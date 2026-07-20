import { FormEvent, useEffect, useState } from "react";

import { api, Funcionario, FuncionarioInput, Unidade } from "../services/api";

const emptyFuncionario: FuncionarioInput = {
  nome: "",
  cpf: "",
  cargo: "",
  salario: 0,
  data_admissao: "",
  unidade_id: 0
};

export function FuncionariosPage() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [form, setForm] = useState<FuncionarioInput>(emptyFuncionario);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError("");

    try {
      const [funcionariosData, unidadesData] = await Promise.all([
        api.funcionarios.list(),
        api.unidades.list()
      ]);
      setFuncionarios(funcionariosData.funcionarios);
      setUnidades(unidadesData.unidades);
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : "Nao foi possivel carregar funcionarios.");
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
        ? await api.funcionarios.update(editingId, form)
        : await api.funcionarios.create(form);

      setMessage(result.message);
      setForm(emptyFuncionario);
      setEditingId(null);
      await loadData();
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : "Nao foi possivel salvar o funcionario.");
    }
  }

  function handleEdit(funcionario: Funcionario) {
    setEditingId(funcionario.id);
    setForm({
      nome: funcionario.nome,
      cpf: funcionario.cpf,
      cargo: funcionario.cargo,
      salario: funcionario.salario,
      data_admissao: funcionario.data_admissao ? funcionario.data_admissao.slice(0, 10) : "",
      unidade_id: funcionario.unidade_id
    });
    setMessage("");
    setError("");
  }

  async function handleDelete(funcionario: Funcionario) {
    if (!confirm(`Excluir o funcionario ${funcionario.nome}?`)) return;

    setMessage("");
    setError("");

    try {
      const result = await api.funcionarios.remove(funcionario.id);
      setMessage(result.message);
      await loadData();
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : "Nao foi possivel excluir o funcionario.");
    }
  }

  return (
    <>
      <div className="mb-4">
        <h1 className="h3 mb-1">Funcionarios</h1>
        <p className="text-secondary mb-0">Cadastro de colaboradores vinculados as unidades.</p>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {unidades.length === 0 && !loading && (
        <div className="alert alert-warning">Cadastre uma unidade antes de cadastrar funcionarios.</div>
      )}

      <div className="row g-4">
        <div className="col-12 col-lg-4">
          <div className="card">
            <div className="card-body">
              <h2 className="h5">{editingId ? "Editar funcionario" : "Novo funcionario"}</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label" htmlFor="funcionario-nome">Nome</label>
                  <input className="form-control" id="funcionario-nome" value={form.nome} onChange={(event) => setForm({ ...form, nome: event.target.value })} required />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="funcionario-cpf">CPF</label>
                  <input className="form-control" id="funcionario-cpf" value={form.cpf} onChange={(event) => setForm({ ...form, cpf: event.target.value })} required />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="funcionario-cargo">Cargo</label>
                  <input className="form-control" id="funcionario-cargo" value={form.cargo} onChange={(event) => setForm({ ...form, cargo: event.target.value })} required />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="funcionario-salario">Salario</label>
                  <input className="form-control" id="funcionario-salario" min="0" step="0.01" type="number" value={form.salario} onChange={(event) => setForm({ ...form, salario: event.target.value })} required />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="funcionario-admissao">Data de admissao</label>
                  <input className="form-control" id="funcionario-admissao" type="date" value={form.data_admissao ?? ""} onChange={(event) => setForm({ ...form, data_admissao: event.target.value })} />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="funcionario-unidade">Unidade</label>
                  <select className="form-select" id="funcionario-unidade" value={form.unidade_id} onChange={(event) => setForm({ ...form, unidade_id: Number(event.target.value) })} required>
                    <option value={0}>Selecione</option>
                    {unidades.map((unidade) => (
                      <option key={unidade.id} value={unidade.id}>{unidade.nome}</option>
                    ))}
                  </select>
                </div>
                <div className="d-flex gap-2">
                  <button className="btn btn-primary" disabled={unidades.length === 0} type="submit">Salvar</button>
                  {editingId && (
                    <button className="btn btn-outline-secondary" type="button" onClick={() => { setEditingId(null); setForm(emptyFuncionario); }}>
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
              <h2 className="h5">Funcionarios cadastrados</h2>
              {loading ? (
                <p className="text-secondary mb-0">Carregando funcionarios...</p>
              ) : funcionarios.length === 0 ? (
                <p className="text-secondary mb-0">Nenhum funcionario cadastrado.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table align-middle">
                    <thead>
                      <tr>
                        <th>Nome</th>
                        <th>Cargo</th>
                        <th>Unidade</th>
                        <th>Salario</th>
                        <th className="text-end">Acoes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {funcionarios.map((funcionario) => (
                        <tr key={funcionario.id}>
                          <td>{funcionario.nome}</td>
                          <td>{funcionario.cargo}</td>
                          <td>{funcionario.unidade_nome}</td>
                          <td>R$ {Number(funcionario.salario).toFixed(2)}</td>
                          <td className="text-end">
                            <button className="btn btn-sm btn-outline-primary me-2" type="button" onClick={() => handleEdit(funcionario)}>Editar</button>
                            <button className="btn btn-sm btn-outline-danger" type="button" onClick={() => handleDelete(funcionario)}>Excluir</button>
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
