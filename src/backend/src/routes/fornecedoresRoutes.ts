import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { Router } from "express";

import { pool } from "../config/database.js";
import { requireAuth } from "../middlewares/requireAuth.js";

type Fornecedor = RowDataPacket & {
  id: number;
  nome: string;
  cnpj: string;
  contato: string;
  produtos_fornecidos: string | null;
};

type FornecedorPayload = {
  nome?: string;
  cnpj?: string;
  contato?: string;
  produtos_fornecidos?: string | null;
};

export const fornecedoresRoutes = Router();

fornecedoresRoutes.use(requireAuth);

fornecedoresRoutes.get("/", async (_request, response) => {
  const [fornecedores] = await pool.query<Fornecedor[]>(
    "SELECT id, nome, cnpj, contato, produtos_fornecidos FROM fornecedores ORDER BY nome"
  );

  response.json({ fornecedores });
});

fornecedoresRoutes.post("/", async (request, response) => {
  const payload = request.body as FornecedorPayload;
  const validation = validateFornecedor(payload);

  if (validation) {
    return response.status(400).json({ message: validation });
  }

  try {
    const [result] = await pool.execute<ResultSetHeader>(
      "INSERT INTO fornecedores (nome, cnpj, contato, produtos_fornecidos) VALUES (?, ?, ?, ?)",
      [payload.nome!.trim(), payload.cnpj!.trim(), payload.contato!.trim(), normalizeOptional(payload.produtos_fornecidos)]
    );

    return response.status(201).json({ message: "Fornecedor cadastrado com sucesso.", id: result.insertId });
  } catch (error) {
    return handleDatabaseError(error, response, "Ja existe um fornecedor cadastrado com este CNPJ.");
  }
});

fornecedoresRoutes.put("/:id", async (request, response) => {
  const id = Number(request.params.id);
  const payload = request.body as FornecedorPayload;
  const validation = validateFornecedor(payload);

  if (!Number.isInteger(id)) {
    return response.status(400).json({ message: "ID do fornecedor invalido." });
  }

  if (validation) {
    return response.status(400).json({ message: validation });
  }

  try {
    const [result] = await pool.execute<ResultSetHeader>(
      "UPDATE fornecedores SET nome = ?, cnpj = ?, contato = ?, produtos_fornecidos = ? WHERE id = ?",
      [payload.nome!.trim(), payload.cnpj!.trim(), payload.contato!.trim(), normalizeOptional(payload.produtos_fornecidos), id]
    );

    if (result.affectedRows === 0) {
      return response.status(404).json({ message: "Fornecedor nao encontrado." });
    }

    return response.json({ message: "Fornecedor atualizado com sucesso." });
  } catch (error) {
    return handleDatabaseError(error, response, "Ja existe um fornecedor cadastrado com este CNPJ.");
  }
});

fornecedoresRoutes.delete("/:id", async (request, response) => {
  const id = Number(request.params.id);

  if (!Number.isInteger(id)) {
    return response.status(400).json({ message: "ID do fornecedor invalido." });
  }

  const [result] = await pool.execute<ResultSetHeader>("DELETE FROM fornecedores WHERE id = ?", [id]);

  if (result.affectedRows === 0) {
    return response.status(404).json({ message: "Fornecedor nao encontrado." });
  }

  return response.json({ message: "Fornecedor excluido com sucesso." });
});

function validateFornecedor(fornecedor: FornecedorPayload) {
  if (!fornecedor.nome?.trim()) return "Informe o nome do fornecedor.";
  if (!fornecedor.cnpj?.trim()) return "Informe o CNPJ do fornecedor.";
  if (!fornecedor.contato?.trim()) return "Informe o contato do fornecedor.";
  return null;
}

function normalizeOptional(value?: string | null) {
  return value?.trim() ? value.trim() : null;
}

function handleDatabaseError(error: unknown, response: import("express").Response, duplicatedMessage: string) {
  if (typeof error === "object" && error !== null && "code" in error && error.code === "ER_DUP_ENTRY") {
    return response.status(409).json({ message: duplicatedMessage });
  }

  const message = error instanceof Error ? error.message : "Erro desconhecido";
  return response.status(500).json({ message: `Erro no banco de dados: ${message}` });
}