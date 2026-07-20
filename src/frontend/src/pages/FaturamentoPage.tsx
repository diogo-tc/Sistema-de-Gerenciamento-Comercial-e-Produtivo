import { FormEvent, useEffect, useMemo, useState } from "react";

import { api, Faturamento, FaturamentoInput } from "../services/api";

const emptyFaturamento: FaturamentoInput = {
  descricao: "",
  valor: 0,
  data_faturamento: "",
  forma_pagamento: "",
  observacao: ""
};

export function FaturamentoPage() {
  const [faturamentos, setFaturamentos] = useState<Faturamento[]>([]);
  const [form, setForm] = useState<FaturamentoInput>(emptyFaturamento);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const total = useMemo(
    () => faturamentos.reduce((sum, item) => sum + Number(item.valor), 0),
    [faturamentos]
  );

  useEffect(() => {
    loadFaturamentos();
  }, []);

  async function loadFaturamentos() {
    setLoading(true);
    setError("");

    try {
      const data = await api.faturamento.list();
      setFaturamentos(data.faturamentos);
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : "Nao foi possivel carregar faturamentos.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      const result = editingId
        ? await api.faturamento.update(editingId, form)
        : await api.faturamento.create(form);

      setMessage(result.message);
      setForm(emptyFaturamento);
      setEditingId(null);
      await loadFaturamentos();
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : "Nao foi possivel salvar o faturamento.");
    }
  }

  function handleEdit(faturamento: Faturamento) {
    setEditingId(faturamento.id);
    setForm({
      descricao: faturamento.descricao,
      valor: faturamento.valor,
      data_faturamento: faturamento.data_faturamento.slice(0, 10),
      forma_pagamento: faturamento.forma_pagamento,
      observacao: faturamento.observacao ?? ""
    });
    setMessage("");
    setError("");
  }

  async function handleDelete(faturamento: Faturamento) {
    if (!confirm(`Excluir o faturamento ${faturamento.descricao}?`)) return;

    setMessage("");
    setError("");

    try {
      const result = await api.faturamento.remove(faturamento.id);
      setMessage(result.message);
      await loadFaturamentos();
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : "Nao foi possivel excluir o faturamento.");
    }
  }

  return (
    <>
      <div className="mb-4">
        <h1 className="h3 mb-1">Faturamento</h1>
        <p className="text-secondary mb-0">Registro basico de valores financeiros relacionados as vendas.</p>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-4">
        <div className="col-12 col-lg-4">
          <div className="card">
            <div className="card-body">
              <h2 className="h5">{editingId ? "Editar faturamento" : "Novo faturamento"}</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label" htmlFor="faturamento-descricao">Descricao</label>
                  <input className="form-control" id="faturamento-descricao" value={form.descricao} onChange={(event) => setForm({ ...form, descricao: event.target.value })} required />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="faturamento-valor">Valor</label>
                  <input className="form-control" id="faturamento-valor" min="0.01" step="0.01" type="number" value={form.valor} onChange={(event) => setForm({ ...form, valor: event.target.value })} required />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="faturamento-data">Data</label>
                  <input className="form-control" id="faturamento-data" type="date" value={form.data_faturamento} onChange={(event) => setForm({ ...form, data_faturamento: event.target.value })} required />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="faturamento-pagamento">Forma de pagamento</label>
                  <input className="form-control" id="faturamento-pagamento" value={form.forma_pagamento} onChange={(event) => setForm({ ...form, forma_pagamento: event.target.value })} required />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="faturamento-observacao">Observacao</label>
                  <input className="form-control" id="faturamento-observacao" value={form.observacao ?? ""} onChange={(event) => setForm({ ...form, observacao: event.target.value })} />
                </div>
                <div className="d-flex gap-2">
                  <button className="btn btn-primary" type="submit">Salvar</button>
                  {editingId && (
                    <button className="btn btn-outline-secondary" type="button" onClick={() => { setEditingId(null); setForm(emptyFaturamento); }}>
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-8">
          <div className="card mb-3">
            <div className="card-body d-flex justify-content-between align-items-center">
              <h2 className="h5 mb-0">Total registrado</h2>
              <strong>R$ {total.toFixed(2)}</strong>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <h2 className="h5">Faturamentos cadastrados</h2>
              {loading ? (
                <p className="text-secondary mb-0">Carregando faturamentos...</p>
              ) : faturamentos.length === 0 ? (
                <p className="text-secondary mb-0">Nenhum faturamento registrado.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table align-middle">
                    <thead>
                      <tr>
                        <th>Descricao</th>
                        <th>Data</th>
                        <th>Pagamento</th>
                        <th>Valor</th>
                        <th className="text-end">Acoes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {faturamentos.map((faturamento) => (
                        <tr key={faturamento.id}>
                          <td>{faturamento.descricao}</td>
                          <td>{faturamento.data_faturamento.slice(0, 10)}</td>
                          <td>{faturamento.forma_pagamento}</td>
                          <td>R$ {Number(faturamento.valor).toFixed(2)}</td>
                          <td className="text-end">
                            <button className="btn btn-sm btn-outline-primary me-2" type="button" onClick={() => handleEdit(faturamento)}>Editar</button>
                            <button className="btn btn-sm btn-outline-danger" type="button" onClick={() => handleDelete(faturamento)}>Excluir</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
