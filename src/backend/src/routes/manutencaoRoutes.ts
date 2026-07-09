import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { Router } from "express";

import { pool } from "../config/database.js";
import { requireAuth } from "../middlewares/requireAuth.js";

type Equipamento = RowDataPacket & {
  id: number;
  nome: string;
  tipo: string;
  descricao: string | null;
  status: string;
};

type Manutencao = RowDataPacket & {
  id: number;
  equipamento_id: number;
  equipamento_nome: string;
  tipo: string;
  data_manutencao: string;
  responsavel_tecnico: string;
  custo: number;
  proxima_revisao: string | null;
  observacao: string | null;
};

type EquipamentoPayload = {
  nome?: string;
  tipo?: string;
  descricao?: string | null;
  status?: string;
};

type ManutencaoPayload = {
  equipamento_id?: number | string;
  tipo?: string;
  data_manutencao?: string;
  responsavel_tecnico?: string;
  custo?: number | string;
  proxima_revisao?: string | null;
  observacao?: string | null;
};

export const manutencaoRoutes = Router();

manutencaoRoutes.use(requireAuth);

manutencaoRoutes.get("/equipamentos", async (_request, response) => {
  const [equipamentos] = await pool.query<Equipamento[]>(
    "SELECT id, nome, tipo, descricao, status FROM equipamentos ORDER BY nome"
  );

  response.json({ equipamentos });
});

manutencaoRoutes.post("/equipamentos", async (request, response) => {
  const payload = request.body as EquipamentoPayload;
  const validation = validateEquipamento(payload);

  if (validation) {
    return response.status(400).json({ message: validation });
  }

  const [result] = await pool.execute<ResultSetHeader>(
    "INSERT INTO equipamentos (nome, tipo, descricao, status) VALUES (?, ?, ?, ?)",
    [payload.nome!.trim(), payload.tipo!.trim(), normalizeOptional(payload.descricao), payload.status!.trim()]
  );

  return response.status(201).json({ message: "Equipamento cadastrado com sucesso.", id: result.insertId });
});

manutencaoRoutes.put("/equipamentos/:id", async (request, response) => {
  const id = Number(request.params.id);
  const payload = request.body as EquipamentoPayload;
  const validation = validateEquipamento(payload);

  if (!Number.isInteger(id)) {
    return response.status(400).json({ message: "ID do equipamento invalido." });
  }

  if (validation) {
    return response.status(400).json({ message: validation });
  }

  const [result] = await pool.execute<ResultSetHeader>(
    "UPDATE equipamentos SET nome = ?, tipo = ?, descricao = ?, status = ? WHERE id = ?",
    [payload.nome!.trim(), payload.tipo!.trim(), normalizeOptional(payload.descricao), payload.status!.trim(), id]
  );

  if (result.affectedRows === 0) {
    return response.status(404).json({ message: "Equipamento nao encontrado." });
  }

  return response.json({ message: "Equipamento atualizado com sucesso." });
});

manutencaoRoutes.delete("/equipamentos/:id", async (request, response) => {
  const id = Number(request.params.id);

  if (!Number.isInteger(id)) {
    return response.status(400).json({ message: "ID do equipamento invalido." });
  }

  const [result] = await pool.execute<ResultSetHeader>("DELETE FROM equipamentos WHERE id = ?", [id]);

  if (result.affectedRows === 0) {
    return response.status(404).json({ message: "Equipamento nao encontrado." });
  }

  return response.json({ message: "Equipamento excluido com sucesso." });
});

manutencaoRoutes.get("/manutencoes", async (_request, response) => {
  const [manutencoes] = await pool.query<Manutencao[]>(`
    SELECT m.id, m.equipamento_id, e.nome AS equipamento_nome, m.tipo, m.data_manutencao,
      m.responsavel_tecnico, m.custo, m.proxima_revisao, m.observacao
    FROM manutencoes m
    INNER JOIN equipamentos e ON e.id = m.equipamento_id
    ORDER BY m.data_manutencao DESC, m.id DESC
  `);

  response.json({ manutencoes });
});

manutencaoRoutes.post("/manutencoes", async (request, response) => {
  const payload = request.body as ManutencaoPayload;
  const validation = validateManutencao(payload);

  if (validation) {
    return response.status(400).json({ message: validation });
  }

  try {
    const dataManutencao = payload.data_manutencao!;
    const [result] = await pool.execute<ResultSetHeader>(
      "INSERT INTO manutencoes (equipamento_id, tipo, data_manutencao, responsavel_tecnico, custo, proxima_revisao, observacao) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        Number(payload.equipamento_id),
        payload.tipo!.trim(),
        dataManutencao,
        payload.responsavel_tecnico!.trim(),
        Number(payload.custo),
        normalizeOptional(payload.proxima_revisao),
        normalizeOptional(payload.observacao)
      ]
    );

    return response.status(201).json({ message: "Manutencao registrada com sucesso.", id: result.insertId });
  } catch (error) {
    return handleManutencaoError(error, response);
  }
});

manutencaoRoutes.put("/manutencoes/:id", async (request, response) => {
  const id = Number(request.params.id);
  const payload = request.body as ManutencaoPayload;
  const validation = validateManutencao(payload);

  if (!Number.isInteger(id)) {
    return response.status(400).json({ message: "ID da manutencao invalido." });
  }

  if (validation) {
    return response.status(400).json({ message: validation });
  }

  try {
    const dataManutencao = payload.data_manutencao!;
    const [result] = await pool.execute<ResultSetHeader>(
      "UPDATE manutencoes SET equipamento_id = ?, tipo = ?, data_manutencao = ?, responsavel_tecnico = ?, custo = ?, proxima_revisao = ?, observacao = ? WHERE id = ?",
      [
        Number(payload.equipamento_id),
        payload.tipo!.trim(),
        dataManutencao,
        payload.responsavel_tecnico!.trim(),
        Number(payload.custo),
        normalizeOptional(payload.proxima_revisao),
        normalizeOptional(payload.observacao),
        id
      ]
    );

    if (result.affectedRows === 0) {
      return response.status(404).json({ message: "Manutencao nao encontrada." });
    }

    return response.json({ message: "Manutencao atualizada com sucesso." });
  } catch (error) {
    return handleManutencaoError(error, response);
  }
});

manutencaoRoutes.delete("/manutencoes/:id", async (request, response) => {
  const id = Number(request.params.id);

  if (!Number.isInteger(id)) {
    return response.status(400).json({ message: "ID da manutencao invalido." });
  }

  const [result] = await pool.execute<ResultSetHeader>("DELETE FROM manutencoes WHERE id = ?", [id]);

  if (result.affectedRows === 0) {
    return response.status(404).json({ message: "Manutencao nao encontrada." });
  }

  return response.json({ message: "Manutencao excluida com sucesso." });
});

function validateEquipamento(equipamento: EquipamentoPayload) {
  if (!equipamento.nome?.trim()) return "Informe o nome do equipamento.";
  if (!equipamento.tipo?.trim()) return "Informe o tipo do equipamento.";
  if (!equipamento.status?.trim()) return "Informe o status do equipamento.";
  return null;
}

function validateManutencao(manutencao: ManutencaoPayload) {
  if (!Number.isInteger(Number(manutencao.equipamento_id))) return "Informe o equipamento.";
  if (!manutencao.tipo?.trim()) return "Informe o tipo da manutencao.";
  if (!manutencao.data_manutencao?.trim()) return "Informe a data da manutencao.";
  if (!manutencao.responsavel_tecnico?.trim()) return "Informe o responsavel tecnico.";
  if (!Number.isFinite(Number(manutencao.custo)) || Number(manutencao.custo) < 0) {
    return "Informe um custo valido.";
  }
  return null;
}

function normalizeOptional(value?: string | null) {
  return value?.trim() ? value.trim() : null;
}

function handleManutencaoError(error: unknown, response: import("express").Response) {
  if (typeof error === "object" && error !== null && "code" in error && error.code === "ER_NO_REFERENCED_ROW_2") {
    return response.status(400).json({ message: "O equipamento informado nao existe." });
  }

  const message = error instanceof Error ? error.message : "Erro desconhecido";
  return response.status(500).json({ message: `Erro no banco de dados: ${message}` });
}
