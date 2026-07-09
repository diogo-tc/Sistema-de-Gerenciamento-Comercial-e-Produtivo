import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { Router } from "express";

import { pool } from "../config/database.js";
import { requireAuth } from "../middlewares/requireAuth.js";

type Faturamento = RowDataPacket & {
  id: number;
  descricao: string;
  valor: number;
  data_faturamento: string;
  forma_pagamento: string;
  observacao: string | null;
};

type FaturamentoPayload = {
  descricao?: string;
  valor?: number | string;
  data_faturamento?: string;
  forma_pagamento?: string;
  observacao?: string | null;
};

export const faturamentoRoutes = Router();

faturamentoRoutes.use(requireAuth);

faturamentoRoutes.get("/", async (_request, response) => {
  const [faturamentos] = await pool.query<Faturamento[]>(
    "SELECT id, descricao, valor, data_faturamento, forma_pagamento, observacao FROM faturamentos ORDER BY data_faturamento DESC, id DESC"
  );

  response.json({ faturamentos });
});

faturamentoRoutes.post("/", async (request, response) => {
  const payload = request.body as FaturamentoPayload;
  const validation = validateFaturamento(payload);

  if (validation) {
    return response.status(400).json({ message: validation });
  }

  const dataFaturamento = payload.data_faturamento!;
  const [result] = await pool.execute<ResultSetHeader>(
    "INSERT INTO faturamentos (descricao, valor, data_faturamento, forma_pagamento, observacao) VALUES (?, ?, ?, ?, ?)",
    [
      payload.descricao!.trim(),
      Number(payload.valor),
      dataFaturamento,
      payload.forma_pagamento!.trim(),
      normalizeOptional(payload.observacao)
    ]
  );

  return response.status(201).json({ message: "Faturamento registrado com sucesso.", id: result.insertId });
});

faturamentoRoutes.put("/:id", async (request, response) => {
  const id = Number(request.params.id);
  const payload = request.body as FaturamentoPayload;
  const validation = validateFaturamento(payload);

  if (!Number.isInteger(id)) {
    return response.status(400).json({ message: "ID do faturamento invalido." });
  }

  if (validation) {
    return response.status(400).json({ message: validation });
  }

  const dataFaturamento = payload.data_faturamento!;
  const [result] = await pool.execute<ResultSetHeader>(
    "UPDATE faturamentos SET descricao = ?, valor = ?, data_faturamento = ?, forma_pagamento = ?, observacao = ? WHERE id = ?",
    [
      payload.descricao!.trim(),
      Number(payload.valor),
      dataFaturamento,
      payload.forma_pagamento!.trim(),
      normalizeOptional(payload.observacao),
      id
    ]
  );

  if (result.affectedRows === 0) {
    return response.status(404).json({ message: "Faturamento nao encontrado." });
  }

  return response.json({ message: "Faturamento atualizado com sucesso." });
});

faturamentoRoutes.delete("/:id", async (request, response) => {
  const id = Number(request.params.id);

  if (!Number.isInteger(id)) {
    return response.status(400).json({ message: "ID do faturamento invalido." });
  }

  const [result] = await pool.execute<ResultSetHeader>("DELETE FROM faturamentos WHERE id = ?", [id]);

  if (result.affectedRows === 0) {
    return response.status(404).json({ message: "Faturamento nao encontrado." });
  }

  return response.json({ message: "Faturamento excluido com sucesso." });
});

function validateFaturamento(faturamento: FaturamentoPayload) {
  if (!faturamento.descricao?.trim()) return "Informe a descricao do faturamento.";
  if (!Number.isFinite(Number(faturamento.valor)) || Number(faturamento.valor) <= 0) {
    return "Informe um valor maior que zero.";
  }
  if (!faturamento.data_faturamento?.trim()) return "Informe a data do faturamento.";
  if (!faturamento.forma_pagamento?.trim()) return "Informe a forma de pagamento.";
  return null;
}

function normalizeOptional(value?: string | null) {
  return value?.trim() ? value.trim() : null;
}
