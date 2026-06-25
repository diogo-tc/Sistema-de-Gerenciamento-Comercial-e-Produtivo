import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { Router } from "express";

import { pool } from "../config/database.js";
import { requireAuth } from "../middlewares/requireAuth.js";

type Funcionario = RowDataPacket & {
  id: number;
  nome: string;
  cpf: string;
  cargo: string;
  salario: number;
  data_admissao: string | null;
  unidade_id: number;
  unidade_nome: string;
};

type FuncionarioPayload = {
  nome?: string;
  cpf?: string;
  cargo?: string;
  salario?: number | string;
  data_admissao?: string | null;
  unidade_id?: number | string;
};

export const funcionariosRoutes = Router();

funcionariosRoutes.use(requireAuth);

funcionariosRoutes.get("/", async (_request, response) => {
  const [funcionarios] = await pool.query<Funcionario[]>(`
    SELECT f.id, f.nome, f.cpf, f.cargo, f.salario, f.data_admissao, f.unidade_id, u.nome AS unidade_nome
    FROM funcionarios f
    INNER JOIN unidades u ON u.id = f.unidade_id
    ORDER BY f.nome
  `);

  response.json({ funcionarios });
});

funcionariosRoutes.post("/", async (request, response) => {
  const payload = request.body as FuncionarioPayload;
  const validation = validateFuncionario(payload);

  if (validation) {
    return response.status(400).json({ message: validation });
  }

  try {
    const [result] = await pool.execute<ResultSetHeader>(
      "INSERT INTO funcionarios (nome, cpf, cargo, salario, data_admissao, unidade_id) VALUES (?, ?, ?, ?, ?, ?)",
      [
        payload.nome!.trim(),
        payload.cpf!.trim(),
        payload.cargo!.trim(),
        Number(payload.salario),
        normalizeOptional(payload.data_admissao),
        Number(payload.unidade_id)
      ]
    );

    return response.status(201).json({ message: "Funcionario cadastrado com sucesso.", id: result.insertId });
  } catch (error) {
    return handleDatabaseError(error, response);
  }
});

funcionariosRoutes.put("/:id", async (request, response) => {
  const id = Number(request.params.id);
  const payload = request.body as FuncionarioPayload;
  const validation = validateFuncionario(payload);

  if (!Number.isInteger(id)) {
    return response.status(400).json({ message: "ID do funcionario invalido." });
  }

  if (validation) {
    return response.status(400).json({ message: validation });
  }

  try {
    const [result] = await pool.execute<ResultSetHeader>(
      "UPDATE funcionarios SET nome = ?, cpf = ?, cargo = ?, salario = ?, data_admissao = ?, unidade_id = ? WHERE id = ?",
      [
        payload.nome!.trim(),
        payload.cpf!.trim(),
        payload.cargo!.trim(),
        Number(payload.salario),
        normalizeOptional(payload.data_admissao),
        Number(payload.unidade_id),
        id
      ]
    );

    if (result.affectedRows === 0) {
      return response.status(404).json({ message: "Funcionario nao encontrado." });
    }

    return response.json({ message: "Funcionario atualizado com sucesso." });
  } catch (error) {
    return handleDatabaseError(error, response);
  }
});

funcionariosRoutes.delete("/:id", async (request, response) => {
  const id = Number(request.params.id);

  if (!Number.isInteger(id)) {
    return response.status(400).json({ message: "ID do funcionario invalido." });
  }

  const [result] = await pool.execute<ResultSetHeader>("DELETE FROM funcionarios WHERE id = ?", [id]);

  if (result.affectedRows === 0) {
    return response.status(404).json({ message: "Funcionario nao encontrado." });
  }

  return response.json({ message: "Funcionario excluido com sucesso." });
});

function validateFuncionario(funcionario: FuncionarioPayload) {
  if (!funcionario.nome?.trim()) return "Informe o nome do funcionario.";
  if (!funcionario.cpf?.trim()) return "Informe o CPF do funcionario.";
  if (!funcionario.cargo?.trim()) return "Informe o cargo do funcionario.";
  if (!Number.isFinite(Number(funcionario.salario)) || Number(funcionario.salario) < 0) {
    return "Informe um salario valido.";
  }
  if (!Number.isInteger(Number(funcionario.unidade_id))) return "Vincule o funcionario a uma unidade.";
  return null;
}

function normalizeOptional(value?: string | null) {
  return value?.trim() ? value.trim() : null;
}

function handleDatabaseError(error: unknown, response: import("express").Response) {
  if (typeof error === "object" && error !== null && "code" in error) {
    if (error.code === "ER_DUP_ENTRY") {
      return response.status(409).json({ message: "Ja existe um funcionario cadastrado com este CPF." });
    }
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return response.status(400).json({ message: "A unidade informada nao existe." });
    }
  }

  const message = error instanceof Error ? error.message : "Erro desconhecido";
  return response.status(500).json({ message: `Erro no banco de dados: ${message}` });
}
