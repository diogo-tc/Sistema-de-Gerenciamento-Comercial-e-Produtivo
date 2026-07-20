import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { Router } from "express";

import { pool } from "../config/database.js";
import { requireAuth } from "../middlewares/requireAuth.js";

type Unidade = RowDataPacket & {
  id: number;
  nome: string;
  endereco: string;
  responsavel: string;
};

type UnidadePayload = {
  nome?: string;
  endereco?: string;
  responsavel?: string;
};

export const unidadesRoutes = Router();

unidadesRoutes.use(requireAuth);

unidadesRoutes.get("/", async (_request, response) => {
  const [unidades] = await pool.query<Unidade[]>(
    "SELECT id, nome, endereco, responsavel FROM unidades ORDER BY nome"
  );

  response.json({ unidades });
});

unidadesRoutes.post("/", async (request, response) => {
  const payload = request.body as UnidadePayload;
  const validation = validateUnidade(payload);

  if (validation) {
    return response.status(400).json({ message: validation });
  }

  const [result] = await pool.execute<ResultSetHeader>(
    "INSERT INTO unidades (nome, endereco, responsavel) VALUES (?, ?, ?)",
    [payload.nome!.trim(), payload.endereco!.trim(), payload.responsavel!.trim()]
  );

  return response.status(201).json({ message: "Unidade cadastrada com sucesso.", id: result.insertId });
});

unidadesRoutes.put("/:id", async (request, response) => {
  const id = Number(request.params.id);
  const payload = request.body as UnidadePayload;
  const validation = validateUnidade(payload);

  if (!Number.isInteger(id)) {
    return response.status(400).json({ message: "ID da unidade invalido." });
  }

  if (validation) {
    return response.status(400).json({ message: validation });
  }

  const [result] = await pool.execute<ResultSetHeader>(
    "UPDATE unidades SET nome = ?, endereco = ?, responsavel = ? WHERE id = ?",
    [payload.nome!.trim(), payload.endereco!.trim(), payload.responsavel!.trim(), id]
  );

  if (result.affectedRows === 0) {
    return response.status(404).json({ message: "Unidade nao encontrada." });
  }

  return response.json({ message: "Unidade atualizada com sucesso." });
});

unidadesRoutes.delete("/:id", async (request, response) => {
  const id = Number(request.params.id);

  if (!Number.isInteger(id)) {
    return response.status(400).json({ message: "ID da unidade invalido." });
  }

  try {
    const [result] = await pool.execute<ResultSetHeader>("DELETE FROM unidades WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return response.status(404).json({ message: "Unidade nao encontrada." });
    }

    return response.json({ message: "Unidade excluida com sucesso." });
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "ER_ROW_IS_REFERENCED_2") {
      return response.status(409).json({ message: "Nao e possivel excluir uma unidade vinculada a funcionarios." });
    }

    const message = error instanceof Error ? error.message : "Erro desconhecido";
    return response.status(500).json({ message: `Erro no banco de dados: ${message}` });
  }
});

function validateUnidade(unidade: UnidadePayload) {
  if (!unidade.nome?.trim()) return "Informe o nome da unidade.";
  if (!unidade.endereco?.trim()) return "Informe o endereco da unidade.";
  if (!unidade.responsavel?.trim()) return "Informe o responsavel pela unidade.";
  return null;
}
