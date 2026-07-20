import { FormEvent, useEffect, useState } from "react";

import { api, Unidade, UnidadeInput } from "../services/api";

const emptyUnidade: UnidadeInput = {
  nome: "",
  endereco: "",
  responsavel: ""
};

export function UnidadesPage() {
  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [form, setForm] = useState<UnidadeInput>(emptyUnidade);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUnidades();
  }, []);

  async function loadUnidades() {
    setLoading(true);
    setError("");

    try {
      const data = await api.unidades.list();
      setUnidades(data.unidades);
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : "Nao foi possivel carregar unidades.");
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
        ? await api.unidades.update(editingId, form)
        : await api.unidades.create(form);

      setMessage(result.message);
      setForm(emptyUnidade);
      setEditingId(null);
      await loadUnidades();
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : "Nao foi possivel salvar a unidade.");
    }
  }

  function handleEdit(unidade: Unidade) {
    setEditingId(unidade.id);
    setForm({
      nome: unidade.nome,
      endereco: unidade.endereco,
      responsavel: unidade.responsavel
    });
    setMessage("");
    setError("");
  }

  async function handleDelete(unidade: Unidade) {
    if (!confirm(`Excluir a unidade ${unidade.nome}?`)) return;

    setMessage("");
    setError("");

    try {
      const result = await api.unidades.remove(unidade.id);
      setMessage(result.message);
      await loadUnidades();
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : "Nao foi possivel excluir a unidade.");
    }
  }

  return (
    <>
      <div className="mb-4">
        <h1 className="h3 mb-1">Unidades</h1>
        <p className="text-secondary mb-0">Cadastro e gerenciamento das unidades da empresa.</p>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-4">
        <div className="col-12 col-lg-4">
          <div className="card">
            <div className="card-body">
              <h2 className="h5">{editingId ? "Editar unidade" : "Nova unidade"}</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label" htmlFor="unidade-nome">Nome</label>
                  <input className="form-control" id="unidade-nome" value={form.nome} onChange={(event) => setForm({ ...form, nome: event.target.value })} required />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="unidade-endereco">Endereco</label>
                  <input className="form-control" id="unidade-endereco" value={form.endereco} onChange={(event) => setForm({ ...form, endereco: event.target.value })} required />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="unidade-responsavel">Responsavel</label>
                  <input className="form-control" id="unidade-responsavel" value={form.responsavel} onChange={(event) => setForm({ ...form, responsavel: event.target.value })} required />
                </div>
                <div className="d-flex gap-2">
                  <button className="btn btn-primary" type="submit">Salvar</button>
                  {editingId && (
                    <button className="btn btn-outline-secondary" type="button" onClick={() => { setEditingId(null); setForm(emptyUnidade); }}>
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-8">
          <div className="card">
            <div className="card-body">
              <h2 className="h5">Unidades cadastradas</h2>
              {loading ? (
                <p className="text-secondary mb-0">Carregando unidades...</p>
              ) : unidades.length === 0 ? (
                <p className="text-secondary mb-0">Nenhuma unidade cadastrada.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table align-middle">
                    <thead>
                      <tr>
                        <th>Nome</th>
                        <th>Endereco</th>
                        <th>Responsavel</th>
                        <th className="text-end">Acoes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {unidades.map((unidade) => (
                        <tr key={unidade.id}>
                          <td>{unidade.nome}</td>
                          <td>{unidade.endereco}</td>
                          <td>{unidade.responsavel}</td>
                          <td className="text-end">
                            <button className="btn btn-sm btn-outline-primary me-2" type="button" onClick={() => handleEdit(unidade)}>Editar</button>
                            <button className="btn btn-sm btn-outline-danger" type="button" onClick={() => handleDelete(unidade)}>Excluir</button>
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
