import { FormEvent, useEffect, useState } from "react";

import { api, Fornecedor, FornecedorInput } from "../services/api";

const emptyFornecedor: FornecedorInput = {
  nome: "",
  cnpj: "",
  contato: "",
  produtos_fornecidos: ""
};

export function FornecedoresPage() {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [form, setForm] = useState<FornecedorInput>(emptyFornecedor);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFornecedores();
  }, []);

  async function loadFornecedores() {
    setLoading(true);
    setError("");

    try {
      const data = await api.fornecedores.list();
      setFornecedores(data.fornecedores);
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : "Nao foi possivel carregar fornecedores.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      if (editingId) {
        const result = await api.fornecedores.update(editingId, form);
        setMessage(result.message);
      } else {
        const result = await api.fornecedores.create(form);
        setMessage(result.message);
      }

      setForm(emptyFornecedor);
      setEditingId(null);
      await loadFornecedores();
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : "Nao foi possivel salvar o fornecedor.");
    }
  }

  function handleEdit(fornecedor: Fornecedor) {
    setEditingId(fornecedor.id);
    setForm({
      nome: fornecedor.nome,
      cnpj: fornecedor.cnpj,
      contato: fornecedor.contato,
      produtos_fornecidos: fornecedor.produtos_fornecidos ?? ""
    });
    setMessage("");
    setError("");
  }

  async function handleDelete(fornecedor: Fornecedor) {
    if (!confirm(`Excluir o fornecedor ${fornecedor.nome}?`)) return;

    setMessage("");
    setError("");

    try {
      const result = await api.fornecedores.remove(fornecedor.id);
      setMessage(result.message);
      await loadFornecedores();
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : "Nao foi possivel excluir o fornecedor.");
    }
  }

  return (
    <>
      <div className="mb-4">
        <h1 className="h3 mb-1">Fornecedores</h1>
        <p className="text-secondary mb-0">Cadastro, consulta, edicao e exclusao de fornecedores.</p>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-4">
        <div className="col-12 col-lg-4">
          <div className="card">
            <div className="card-body">
              <h2 className="h5">{editingId ? "Editar fornecedor" : "Novo fornecedor"}</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label" htmlFor="fornecedor-nome">Nome</label>
                  <input className="form-control" id="fornecedor-nome" value={form.nome} onChange={(event) => setForm({ ...form, nome: event.target.value })} required />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="fornecedor-cnpj">CNPJ</label>
                  <input className="form-control" id="fornecedor-cnpj" value={form.cnpj} onChange={(event) => setForm({ ...form, cnpj: event.target.value })} required />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="fornecedor-contato">Contato</label>
                  <input className="form-control" id="fornecedor-contato" value={form.contato} onChange={(event) => setForm({ ...form, contato: event.target.value })} required />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="fornecedor-produtos">Produtos fornecidos</label>
                  <input className="form-control" id="fornecedor-produtos" value={form.produtos_fornecidos ?? ""} onChange={(event) => setForm({ ...form, produtos_fornecidos: event.target.value })} />
                </div>
                <div className="d-flex gap-2">
                  <button className="btn btn-primary" type="submit">Salvar</button>
                  {editingId && (
                    <button className="btn btn-outline-secondary" type="button" onClick={() => { setEditingId(null); setForm(emptyFornecedor); }}>
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
              <h2 className="h5">Fornecedores cadastrados</h2>
              {loading ? (
                <p className="text-secondary mb-0">Carregando fornecedores...</p>
              ) : fornecedores.length === 0 ? (
                <p className="text-secondary mb-0">Nenhum fornecedor cadastrado.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table align-middle">
                    <thead>
                      <tr>
                        <th>Nome</th>
                        <th>CNPJ</th>
                        <th>Contato</th>
                        <th className="text-end">Acoes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fornecedores.map((fornecedor) => (
                        <tr key={fornecedor.id}>
                          <td>{fornecedor.nome}</td>
                          <td>{fornecedor.cnpj}</td>
                          <td>{fornecedor.contato}</td>
                          <td className="text-end">
                            <button className="btn btn-sm btn-outline-primary me-2" type="button" onClick={() => handleEdit(fornecedor)}>Editar</button>
                            <button className="btn btn-sm btn-outline-danger" type="button" onClick={() => handleDelete(fornecedor)}>Excluir</button>
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