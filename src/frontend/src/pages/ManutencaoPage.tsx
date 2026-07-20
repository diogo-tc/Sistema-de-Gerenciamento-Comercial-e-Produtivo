import { FormEvent, useEffect, useState } from "react";

import { api, Equipamento, EquipamentoInput, Manutencao, ManutencaoInput } from "../services/api";

const emptyEquipamento: EquipamentoInput = {
  nome: "",
  tipo: "",
  descricao: "",
  status: "Ativo"
};

const emptyManutencao: ManutencaoInput = {
  equipamento_id: 0,
  tipo: "",
  data_manutencao: "",
  responsavel_tecnico: "",
  custo: 0,
  proxima_revisao: "",
  observacao: ""
};

export function ManutencaoPage() {
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);
  const [manutencoes, setManutencoes] = useState<Manutencao[]>([]);
  const [equipamentoForm, setEquipamentoForm] = useState<EquipamentoInput>(emptyEquipamento);
  const [manutencaoForm, setManutencaoForm] = useState<ManutencaoInput>(emptyManutencao);
  const [editingEquipamentoId, setEditingEquipamentoId] = useState<number | null>(null);
  const [editingManutencaoId, setEditingManutencaoId] = useState<number | null>(null);
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
      const [equipamentosData, manutencoesData] = await Promise.all([
        api.manutencao.equipamentos(),
        api.manutencao.manutencoes()
      ]);
      setEquipamentos(equipamentosData.equipamentos);
      setManutencoes(manutencoesData.manutencoes);
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : "Nao foi possivel carregar manutencoes.");
    } finally {
      setLoading(false);
    }
  }

  async function handleEquipamentoSubmit(event: FormEvent) {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      const result = editingEquipamentoId
        ? await api.manutencao.updateEquipamento(editingEquipamentoId, equipamentoForm)
        : await api.manutencao.createEquipamento(equipamentoForm);

      setMessage(result.message);
      setEquipamentoForm(emptyEquipamento);
      setEditingEquipamentoId(null);
      await loadData();
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : "Nao foi possivel salvar o equipamento.");
    }
  }

  async function handleManutencaoSubmit(event: FormEvent) {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      const result = editingManutencaoId
        ? await api.manutencao.updateManutencao(editingManutencaoId, manutencaoForm)
        : await api.manutencao.createManutencao(manutencaoForm);

      setMessage(result.message);
      setManutencaoForm(emptyManutencao);
      setEditingManutencaoId(null);
      await loadData();
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : "Nao foi possivel salvar a manutencao.");
    }
  }

  function handleEditEquipamento(equipamento: Equipamento) {
    setEditingEquipamentoId(equipamento.id);
    setEquipamentoForm({
      nome: equipamento.nome,
      tipo: equipamento.tipo,
      descricao: equipamento.descricao ?? "",
      status: equipamento.status
    });
    setMessage("");
    setError("");
  }

  function handleEditManutencao(manutencao: Manutencao) {
    setEditingManutencaoId(manutencao.id);
    setManutencaoForm({
      equipamento_id: manutencao.equipamento_id,
      tipo: manutencao.tipo,
      data_manutencao: manutencao.data_manutencao.slice(0, 10),
      responsavel_tecnico: manutencao.responsavel_tecnico,
      custo: manutencao.custo,
      proxima_revisao: manutencao.proxima_revisao ? manutencao.proxima_revisao.slice(0, 10) : "",
      observacao: manutencao.observacao ?? ""
    });
    setMessage("");
    setError("");
  }

  async function handleDeleteEquipamento(equipamento: Equipamento) {
    if (!confirm(`Excluir o equipamento ${equipamento.nome}?`)) return;

    try {
      const result = await api.manutencao.removeEquipamento(equipamento.id);
      setMessage(result.message);
      await loadData();
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : "Nao foi possivel excluir o equipamento.");
    }
  }

  async function handleDeleteManutencao(manutencao: Manutencao) {
    if (!confirm(`Excluir a manutencao de ${manutencao.equipamento_nome}?`)) return;

    try {
      const result = await api.manutencao.removeManutencao(manutencao.id);
      setMessage(result.message);
      await loadData();
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : "Nao foi possivel excluir a manutencao.");
    }
  }

  return (
    <>
      <div className="mb-4">
        <h1 className="h3 mb-1">Manutencao</h1>
        <p className="text-secondary mb-0">Cadastro de equipamentos e registro de manutencoes realizadas.</p>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-4 mb-4">
        <div className="col-12 col-lg-6">
          <div className="card h-100">
            <div className="card-body">
              <h2 className="h5">{editingEquipamentoId ? "Editar equipamento" : "Novo equipamento"}</h2>
              <form onSubmit={handleEquipamentoSubmit}>
                <div className="mb-3">
                  <label className="form-label" htmlFor="equipamento-nome">Nome</label>
                  <input className="form-control" id="equipamento-nome" value={equipamentoForm.nome} onChange={(event) => setEquipamentoForm({ ...equipamentoForm, nome: event.target.value })} required />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="equipamento-tipo">Tipo</label>
                  <input className="form-control" id="equipamento-tipo" value={equipamentoForm.tipo} onChange={(event) => setEquipamentoForm({ ...equipamentoForm, tipo: event.target.value })} required />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="equipamento-status">Status</label>
                  <select className="form-select" id="equipamento-status" value={equipamentoForm.status} onChange={(event) => setEquipamentoForm({ ...equipamentoForm, status: event.target.value })}>
                    <option value="Ativo">Ativo</option>
                    <option value="Em manutencao">Em manutencao</option>
                    <option value="Inativo">Inativo</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="equipamento-descricao">Descricao</label>
                  <input className="form-control" id="equipamento-descricao" value={equipamentoForm.descricao ?? ""} onChange={(event) => setEquipamentoForm({ ...equipamentoForm, descricao: event.target.value })} />
                </div>
                <div className="d-flex gap-2">
                  <button className="btn btn-primary" type="submit">Salvar</button>
                  {editingEquipamentoId && (
                    <button className="btn btn-outline-secondary" type="button" onClick={() => { setEditingEquipamentoId(null); setEquipamentoForm(emptyEquipamento); }}>
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="card h-100">
            <div className="card-body">
              <h2 className="h5">{editingManutencaoId ? "Editar manutencao" : "Nova manutencao"}</h2>
              {equipamentos.length === 0 && !loading && (
                <div className="alert alert-warning">Cadastre um equipamento antes de registrar manutencoes.</div>
              )}
              <form onSubmit={handleManutencaoSubmit}>
                <div className="mb-3">
                  <label className="form-label" htmlFor="manutencao-equipamento">Equipamento</label>
                  <select className="form-select" id="manutencao-equipamento" value={manutencaoForm.equipamento_id} onChange={(event) => setManutencaoForm({ ...manutencaoForm, equipamento_id: Number(event.target.value) })} required>
                    <option value={0}>Selecione</option>
                    {equipamentos.map((equipamento) => (
                      <option key={equipamento.id} value={equipamento.id}>{equipamento.nome}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="manutencao-tipo">Tipo</label>
                  <input className="form-control" id="manutencao-tipo" value={manutencaoForm.tipo} onChange={(event) => setManutencaoForm({ ...manutencaoForm, tipo: event.target.value })} required />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="manutencao-data">Data</label>
                  <input className="form-control" id="manutencao-data" type="date" value={manutencaoForm.data_manutencao} onChange={(event) => setManutencaoForm({ ...manutencaoForm, data_manutencao: event.target.value })} required />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="manutencao-responsavel">Responsavel tecnico</label>
                  <input className="form-control" id="manutencao-responsavel" value={manutencaoForm.responsavel_tecnico} onChange={(event) => setManutencaoForm({ ...manutencaoForm, responsavel_tecnico: event.target.value })} required />
                </div>
                <div className="row">
                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label" htmlFor="manutencao-custo">Custo</label>
                    <input className="form-control" id="manutencao-custo" min="0" step="0.01" type="number" value={manutencaoForm.custo} onChange={(event) => setManutencaoForm({ ...manutencaoForm, custo: event.target.value })} />
                  </div>
                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label" htmlFor="manutencao-revisao">Proxima revisao</label>
                    <input className="form-control" id="manutencao-revisao" type="date" value={manutencaoForm.proxima_revisao ?? ""} onChange={(event) => setManutencaoForm({ ...manutencaoForm, proxima_revisao: event.target.value })} />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="manutencao-observacao">Observacao</label>
                  <input className="form-control" id="manutencao-observacao" value={manutencaoForm.observacao ?? ""} onChange={(event) => setManutencaoForm({ ...manutencaoForm, observacao: event.target.value })} />
                </div>
                <div className="d-flex gap-2">
                  <button className="btn btn-primary" disabled={equipamentos.length === 0} type="submit">Salvar</button>
                  {editingManutencaoId && (
                    <button className="btn btn-outline-secondary" type="button" onClick={() => { setEditingManutencaoId(null); setManutencaoForm(emptyManutencao); }}>
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-xl-5">
          <div className="card">
            <div className="card-body">
              <h2 className="h5">Equipamentos</h2>
              {equipamentos.length === 0 ? (
                <p className="text-secondary mb-0">Nenhum equipamento cadastrado.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table align-middle">
                    <thead>
                      <tr>
                        <th>Nome</th>
                        <th>Status</th>
                        <th className="text-end">Acoes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {equipamentos.map((equipamento) => (
                        <tr key={equipamento.id}>
                          <td>{equipamento.nome}</td>
                          <td>{equipamento.status}</td>
                          <td className="text-end">
                            <button className="btn btn-sm btn-outline-primary me-2" type="button" onClick={() => handleEditEquipamento(equipamento)}>Editar</button>
                            <button className="btn btn-sm btn-outline-danger" type="button" onClick={() => handleDeleteEquipamento(equipamento)}>Excluir</button>
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

        <div className="col-12 col-xl-7">
          <div className="card">
            <div className="card-body">
              <h2 className="h5">Manutencoes registradas</h2>
              {manutencoes.length === 0 ? (
                <p className="text-secondary mb-0">Nenhuma manutencao registrada.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table align-middle">
                    <thead>
                      <tr>
                        <th>Equipamento</th>
                        <th>Tipo</th>
                        <th>Data</th>
                        <th>Custo</th>
                        <th className="text-end">Acoes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {manutencoes.map((manutencao) => (
                        <tr key={manutencao.id}>
                          <td>{manutencao.equipamento_nome}</td>
                          <td>{manutencao.tipo}</td>
                          <td>{manutencao.data_manutencao.slice(0, 10)}</td>
                          <td>R$ {Number(manutencao.custo).toFixed(2)}</td>
                          <td className="text-end">
                            <button className="btn btn-sm btn-outline-primary me-2" type="button" onClick={() => handleEditManutencao(manutencao)}>Editar</button>
                            <button className="btn btn-sm btn-outline-danger" type="button" onClick={() => handleDeleteManutencao(manutencao)}>Excluir</button>
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
