import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { Router } from "express";

import { pool } from "../config/database.js";
import { requireAuth } from "../middlewares/requireAuth.js";

type Cliente = RowDataPacket & {
  id: number;
  nome: string;
  cpf: string;
  telefone: string;
  endereco: string | null;
};

type ClientePayload = {
  nome?: string;
  cpf?: string;
  telefone?: string;
  endereco?: string | null;
};

export const clientesRoutes = Router();

clientesRoutes.use(requireAuth);

clientesRoutes.get("/", async (_request, response) => {
  const [clientes] = await pool.query<Cliente[]>(
    "SELECT id, nome, cpf, telefone, endereco FROM clientes ORDER BY nome"
  );

  response.json({ clientes });
});

clientesRoutes.post("/", async (request, response) => {
  const payload = request.body as ClientePayload;
  const validation = validateCliente(payload);

  if (validation) {
    return response.status(400).json({ message: validation });
  }

  try {
    const [result] = await pool.execute<ResultSetHeader>(
      "INSERT INTO clientes (nome, cpf, telefone, endereco) VALUES (?, ?, ?, ?)",
      [payload.nome!.trim(), payload.cpf!.trim(), payload.telefone!.trim(), normalizeOptional(payload.endereco)]
    );

    return response.status(201).json({ message: "Cliente cadastrado com sucesso.", id: result.insertId });
  } catch (error) {
    return handleDatabaseError(error, response, "Ja existe um cliente cadastrado com este CPF.");
  }
});

clientesRoutes.put("/:id", async (request, response) => {
  const id = Number(request.params.id);
  const payload = request.body as ClientePayload;
  const validation = validateCliente(payload);

  if (!Number.isInteger(id)) {
    return response.status(400).json({ message: "ID do cliente invalido." });
  }

  if (validation) {
    return response.status(400).json({ message: validation });
  }

  try {
    const [result] = await pool.execute<ResultSetHeader>(
      "UPDATE clientes SET nome = ?, cpf = ?, telefone = ?, endereco = ? WHERE id = ?",
      [payload.nome!.trim(), payload.cpf!.trim(), payload.telefone!.trim(), normalizeOptional(payload.endereco), id]
    );

    if (result.affectedRows === 0) {
      return response.status(404).json({ message: "Cliente nao encontrado." });
    }

    return response.json({ message: "Cliente atualizado com sucesso." });
  } catch (error) {
    return handleDatabaseError(error, response, "Ja existe um cliente cadastrado com este CPF.");
  }
});

clientesRoutes.delete("/:id", async (request, response) => {
  const id = Number(request.params.id);

  if (!Number.isInteger(id)) {
    return response.status(400).json({ message: "ID do cliente invalido." });
  }

  const [result] = await pool.execute<ResultSetHeader>("DELETE FROM clientes WHERE id = ?", [id]);

  if (result.affectedRows === 0) {
    return response.status(404).json({ message: "Cliente nao encontrado." });
  }

  return response.json({ message: "Cliente excluido com sucesso." });
});

function validateCliente(cliente: ClientePayload) {
  if (!cliente.nome?.trim()) return "Informe o nome do cliente.";
  if (!cliente.cpf?.trim()) return "Informe o CPF do cliente.";
  if (!cliente.telefone?.trim()) return "Informe o telefone do cliente.";
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