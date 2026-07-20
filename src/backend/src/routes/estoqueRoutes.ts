import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { Router } from "express";

import { pool } from "../config/database.js";
import { requireAuth } from "../middlewares/requireAuth.js";

type ItemEstoque = RowDataPacket & {
  id: number;
  nome: string;
  tipo: string;
  quantidade: number;
  quantidade_minima: number;
  validade: string | null;
};

type Movimentacao = RowDataPacket & {
  id: number;
  item_id: number;
  item_nome: string;
  tipo: string;
  quantidade: number;
  observacao: string | null;
  criado_em: string;
};

type ItemPayload = {
  nome?: string;
  tipo?: string;
  quantidade_minima?: number | string;
  validade?: string | null;
};

type MovimentoPayload = {
  item_id?: number | string;
  tipo?: string;
  quantidade?: number | string;
  observacao?: string | null;
};

export const estoqueRoutes = Router();

estoqueRoutes.use(requireAuth);

estoqueRoutes.get("/", async (_request, response) => {
  const [itens] = await pool.query<ItemEstoque[]>(
    "SELECT id, nome, tipo, quantidade, quantidade_minima, validade FROM estoque ORDER BY nome"
  );

  response.json({ itens });
});

estoqueRoutes.post("/", async (request, response) => {
  const payload = request.body as ItemPayload;
  const validation = validateItem(payload);

  if (validation) {
    return response.status(400).json({ message: validation });
  }

  const [result] = await pool.execute<ResultSetHeader>(
    "INSERT INTO estoque (nome, tipo, quantidade, quantidade_minima, validade) VALUES (?, ?, 0, ?, ?)",
    [payload.nome!.trim(), payload.tipo!.trim(), Number(payload.quantidade_minima ?? 0), normalizeOptional(payload.validade)]
  );

  return response.status(201).json({ message: "Item de estoque cadastrado com sucesso.", id: result.insertId });
});

estoqueRoutes.put("/:id", async (request, response) => {
  const id = Number(request.params.id);
  const payload = request.body as ItemPayload;
  const validation = validateItem(payload);

  if (!Number.isInteger(id)) {
    return response.status(400).json({ message: "ID do item invalido." });
  }

  if (validation) {
    return response.status(400).json({ message: validation });
  }

  const [result] = await pool.execute<ResultSetHeader>(
    "UPDATE estoque SET nome = ?, tipo = ?, quantidade_minima = ?, validade = ? WHERE id = ?",
    [payload.nome!.trim(), payload.tipo!.trim(), Number(payload.quantidade_minima ?? 0), normalizeOptional(payload.validade), id]
  );

  if (result.affectedRows === 0) {
    return response.status(404).json({ message: "Item de estoque nao encontrado." });
  }

  return response.json({ message: "Item de estoque atualizado com sucesso." });
});

estoqueRoutes.delete("/:id", async (request, response) => {
  const id = Number(request.params.id);

  if (!Number.isInteger(id)) {
    return response.status(400).json({ message: "ID do item invalido." });
  }

  const [result] = await pool.execute<ResultSetHeader>("DELETE FROM estoque WHERE id = ?", [id]);

  if (result.affectedRows === 0) {
    return response.status(404).json({ message: "Item de estoque nao encontrado." });
  }

  return response.json({ message: "Item de estoque excluido com sucesso." });
});

estoqueRoutes.get("/movimentacoes", async (_request, response) => {
  const [movimentacoes] = await pool.query<Movimentacao[]>(`
    SELECT m.id, m.item_id, e.nome AS item_nome, m.tipo, m.quantidade, m.observacao, m.criado_em
    FROM estoque_movimentacoes m
    INNER JOIN estoque e ON e.id = m.item_id
    ORDER BY m.criado_em DESC, m.id DESC
    LIMIT 50
  `);

  response.json({ movimentacoes });
});

estoqueRoutes.post("/movimentacoes", async (request, response) => {
  const payload = request.body as MovimentoPayload;
  const validation = validateMovimento(payload);

  if (validation) {
    return response.status(400).json({ message: validation });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const itemId = Number(payload.item_id);
    const quantidade = Number(payload.quantidade);
    const tipo = payload.tipo as "entrada" | "saida";
    const [rows] = await connection.query<ItemEstoque[]>(
      "SELECT id, quantidade FROM estoque WHERE id = ? FOR UPDATE",
      [itemId]
    );

    if (rows.length === 0) {
      await connection.rollback();
      return response.status(404).json({ message: "Item de estoque nao encontrado." });
    }

    const atual = Number(rows[0].quantidade);
    const novaQuantidade = tipo === "saida" ? atual - quantidade : atual + quantidade;

    if (novaQuantidade < 0) {
      await connection.rollback();
      return response.status(400).json({ message: "A saida nao pode deixar o estoque negativo." });
    }

    await connection.execute("UPDATE estoque SET quantidade = ? WHERE id = ?", [novaQuantidade, itemId]);
    await connection.execute(
      "INSERT INTO estoque_movimentacoes (item_id, tipo, quantidade, observacao) VALUES (?, ?, ?, ?)",
      [itemId, tipo, quantidade, normalizeOptional(payload.observacao)]
    );

    await connection.commit();
    return response.status(201).json({ message: "Movimentacao registrada com sucesso." });
  } catch (error) {
    await connection.rollback();
    const message = error instanceof Error ? error.message : "Erro desconhecido";
    return response.status(500).json({ message: `Erro no banco de dados: ${message}` });
  } finally {
    connection.release();
  }
});

function validateItem(item: ItemPayload) {
  if (!item.nome?.trim()) return "Informe o nome do item.";
  if (!item.tipo?.trim()) return "Informe o tipo do item.";
  if (!Number.isFinite(Number(item.quantidade_minima ?? 0)) || Number(item.quantidade_minima ?? 0) < 0) {
    return "Informe uma quantidade minima valida.";
  }
  return null;
}

function validateMovimento(movimento: MovimentoPayload) {
  if (!Number.isInteger(Number(movimento.item_id))) return "Informe o item movimentado.";
  if (movimento.tipo !== "entrada" && movimento.tipo !== "saida") return "Informe se a movimentacao e entrada ou saida.";
  if (!Number.isFinite(Number(movimento.quantidade)) || Number(movimento.quantidade) <= 0) {
    return "Informe uma quantidade maior que zero.";
  }
  return null;
}

function normalizeOptional(value?: string | null) {
  return value?.trim() ? value.trim() : null;
}
