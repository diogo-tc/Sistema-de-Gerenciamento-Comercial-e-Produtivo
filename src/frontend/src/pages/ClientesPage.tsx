import { FormEvent, useEffect, useState } from "react";

import { api, Cliente, ClienteInput } from "../services/api";

const emptyCliente: ClienteInput = {
  nome: "",
  cpf: "",
  telefone: "",
  endereco: ""
};

export function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [form, setForm] = useState<ClienteInput>(emptyCliente);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClientes();
  }, []);

  async function loadClientes() {
    setLoading(true);
    setError("");

    try {
      const data = await api.clientes.list();
      setClientes(data.clientes);
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : "Nao foi possivel carregar clientes.");
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
        const result = await api.clientes.update(editingId, form);
        setMessage(result.message);
      } else {
        const result = await api.clientes.create(form);
        setMessage(result.message);
      }

      setForm(emptyCliente);
      setEditingId(null);
      await loadClientes();
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : "Nao foi possivel salvar o cliente.");
    }
  }

  function handleEdit(cliente: Cliente) {
    setEditingId(cliente.id);
    setForm({
      nome: cliente.nome,
      cpf: cliente.cpf,
      telefone: cliente.telefone,
      endereco: cliente.endereco ?? ""
    });
    setMessage("");
    setError("");
  }

  async function handleDelete(cliente: Cliente) {
    if (!confirm(`Excluir o cliente ${cliente.nome}?`)) return;

    setMessage("");
    setError("");

    try {
      const result = await api.clientes.remove(cliente.id);
      setMessage(result.message);
      await loadClientes();
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : "Nao foi possivel excluir o cliente.");
    }
  }

  return (
    <>
      <div className="mb-4">
        <h1 className="h3 mb-1">Clientes</h1>
        <p className="text-secondary mb-0">Cadastro, consulta, edicao e exclusao de clientes.</p>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-4">
        <div className="col-12 col-lg-4">
          <div className="card">
            <div className="card-body">
              <h2 className="h5">{editingId ? "Editar cliente" : "Novo cliente"}</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label" htmlFor="cliente-nome">Nome</label>
                  <input className="form-control" id="cliente-nome" value={form.nome} onChange={(event) => setForm({ ...form, nome: event.target.value })} required />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="cliente-cpf">CPF</label>
                  <input className="form-control" id="cliente-cpf" value={form.cpf} onChange={(event) => setForm({ ...form, cpf: event.target.value })} required />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="cliente-telefone">Telefone</label>
                  <input className="form-control" id="cliente-telefone" value={form.telefone} onChange={(event) => setForm({ ...form, telefone: event.target.value })} required />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="cliente-endereco">Endereco</label>
                  <input className="form-control" id="cliente-endereco" value={form.endereco ?? ""} onChange={(event) => setForm({ ...form, endereco: event.target.value })} />
                </div>
                <div className="d-flex gap-2">
                  <button className="btn btn-primary" type="submit">Salvar</button>
                  {editingId && (
                    <button className="btn btn-outline-secondary" type="button" onClick={() => { setEditingId(null); setForm(emptyCliente); }}>
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
              <h2 className="h5">Clientes cadastrados</h2>
              {loading ? (
                <p className="text-secondary mb-0">Carregando clientes...</p>
              ) : clientes.length === 0 ? (
                <p className="text-secondary mb-0">Nenhum cliente cadastrado.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table align-middle">
                    <thead>
                      <tr>
                        <th>Nome</th>
                        <th>CPF</th>
                        <th>Telefone</th>
                        <th className="text-end">Acoes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clientes.map((cliente) => (
                        <tr key={cliente.id}>
                          <td>{cliente.nome}</td>
                          <td>{cliente.cpf}</td>
                          <td>{cliente.telefone}</td>
                          <td className="text-end">
                            <button className="btn btn-sm btn-outline-primary me-2" type="button" onClick={() => handleEdit(cliente)}>Editar</button>
                            <button className="btn btn-sm btn-outline-danger" type="button" onClick={() => handleDelete(cliente)}>Excluir</button>
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