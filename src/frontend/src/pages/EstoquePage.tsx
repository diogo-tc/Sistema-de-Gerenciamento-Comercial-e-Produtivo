import { FormEvent, useEffect, useState } from "react";

import { api, ItemEstoque, ItemEstoqueInput, MovimentacaoEstoque, MovimentacaoInput } from "../services/api";

const emptyItem: ItemEstoqueInput = {
  nome: "",
  tipo: "",
  quantidade_minima: 0,
  validade: ""
};

const emptyMovimento: MovimentacaoInput = {
  item_id: 0,
  tipo: "entrada",
  quantidade: 1,
  observacao: ""
};

export function EstoquePage() {
  const [itens, setItens] = useState<ItemEstoque[]>([]);
  const [movimentacoes, setMovimentacoes] = useState<MovimentacaoEstoque[]>([]);
  const [itemForm, setItemForm] = useState<ItemEstoqueInput>(emptyItem);
  const [movimentoForm, setMovimentoForm] = useState<MovimentacaoInput>(emptyMovimento);
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
      const [itensData, movimentosData] = await Promise.all([
        api.estoque.list(),
        api.estoque.movements()
      ]);
      setItens(itensData.itens);
      setMovimentacoes(movimentosData.movimentacoes);
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : "Nao foi possivel carregar o estoque.");
    } finally {
      setLoading(false);
    }
  }

  async function handleItemSubmit(event: FormEvent) {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      const result = editingId
        ? await api.estoque.update(editingId, itemForm)
        : await api.estoque.create(itemForm);

      setMessage(result.message);
      setItemForm(emptyItem);
      setEditingId(null);
      await loadData();
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : "Nao foi possivel salvar o item.");
    }
  }

  async function handleMovimentoSubmit(event: FormEvent) {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      const result = await api.estoque.move(movimentoForm);
      setMessage(result.message);
      setMovimentoForm(emptyMovimento);
      await loadData();
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : "Nao foi possivel registrar a movimentacao.");
    }
  }

  function handleEdit(item: ItemEstoque) {
    setEditingId(item.id);
    setItemForm({
      nome: item.nome,
      tipo: item.tipo,
      quantidade_minima: item.quantidade_minima,
      validade: item.validade ? item.validade.slice(0, 10) : ""
    });
    setMessage("");
    setError("");
  }

  async function handleDelete(item: ItemEstoque) {
    if (!confirm(`Excluir o item ${item.nome}?`)) return;

    setMessage("");
    setError("");

    try {
      const result = await api.estoque.remove(item.id);
      setMessage(result.message);
      await loadData();
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : "Nao foi possivel excluir o item.");
    }
  }

  return (
    <>
      <div className="mb-4">
        <h1 className="h3 mb-1">Estoque</h1>
        <p className="text-secondary mb-0">Cadastro de itens, entradas, saidas e controle de quantidade disponivel.</p>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-4 mb-4">
        <div className="col-12 col-lg-4">
          <div className="card h-100">
            <div className="card-body">
              <h2 className="h5">{editingId ? "Editar item" : "Novo item"}</h2>
              <form onSubmit={handleItemSubmit}>
                <div className="mb-3">
                  <label className="form-label" htmlFor="estoque-nome">Nome</label>
                  <input className="form-control" id="estoque-nome" value={itemForm.nome} onChange={(event) => setItemForm({ ...itemForm, nome: event.target.value })} required />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="estoque-tipo">Tipo</label>
                  <input className="form-control" id="estoque-tipo" placeholder="Produto ou insumo" value={itemForm.tipo} onChange={(event) => setItemForm({ ...itemForm, tipo: event.target.value })} required />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="estoque-minima">Quantidade minima</label>
                  <input className="form-control" id="estoque-minima" min="0" step="0.01" type="number" value={itemForm.quantidade_minima} onChange={(event) => setItemForm({ ...itemForm, quantidade_minima: event.target.value })} />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="estoque-validade">Validade</label>
                  <input className="form-control" id="estoque-validade" type="date" value={itemForm.validade ?? ""} onChange={(event) => setItemForm({ ...itemForm, validade: event.target.value })} />
                </div>
                <div className="d-flex gap-2">
                  <button className="btn btn-primary" type="submit">Salvar</button>
                  {editingId && (
                    <button className="btn btn-outline-secondary" type="button" onClick={() => { setEditingId(null); setItemForm(emptyItem); }}>
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="card h-100">
            <div className="card-body">
              <h2 className="h5">Movimentar estoque</h2>
              <form onSubmit={handleMovimentoSubmit}>
                <div className="mb-3">
                  <label className="form-label" htmlFor="movimento-item">Item</label>
                  <select className="form-select" id="movimento-item" value={movimentoForm.item_id} onChange={(event) => setMovimentoForm({ ...movimentoForm, item_id: Number(event.target.value) })} required>
                    <option value={0}>Selecione</option>
                    {itens.map((item) => (
                      <option key={item.id} value={item.id}>{item.nome}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="movimento-tipo">Tipo</label>
                  <select className="form-select" id="movimento-tipo" value={movimentoForm.tipo} onChange={(event) => setMovimentoForm({ ...movimentoForm, tipo: event.target.value as "entrada" | "saida" })}>
                    <option value="entrada">Entrada</option>
                    <option value="saida">Saida</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="movimento-quantidade">Quantidade</label>
                  <input className="form-control" id="movimento-quantidade" min="0.01" step="0.01" type="number" value={movimentoForm.quantidade} onChange={(event) => setMovimentoForm({ ...movimentoForm, quantidade: event.target.value })} required />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="movimento-observacao">Observacao</label>
                  <input className="form-control" id="movimento-observacao" value={movimentoForm.observacao ?? ""} onChange={(event) => setMovimentoForm({ ...movimentoForm, observacao: event.target.value })} />
                </div>
                <button className="btn btn-primary" disabled={itens.length === 0} type="submit">Registrar</button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="card h-100">
            <div className="card-body">
              <h2 className="h5">Ultimas movimentacoes</h2>
              {movimentacoes.length === 0 ? (
                <p className="text-secondary mb-0">Nenhuma movimentacao registrada.</p>
              ) : (
                <div className="list-group list-group-flush">
                  {movimentacoes.slice(0, 5).map((movimento) => (
                    <div className="list-group-item px-0" key={movimento.id}>
                      <div className="d-flex justify-content-between">
                        <strong>{movimento.item_nome}</strong>
                        <span className={movimento.tipo === "entrada" ? "text-success" : "text-danger"}>{movimento.tipo}</span>
                      </div>
                      <small className="text-secondary">Quantidade: {Number(movimento.quantidade).toFixed(2)}</small>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h2 className="h5">Itens cadastrados</h2>
          {loading ? (
            <p className="text-secondary mb-0">Carregando estoque...</p>
          ) : itens.length === 0 ? (
            <p className="text-secondary mb-0">Nenhum item cadastrado.</p>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Tipo</th>
                    <th>Disponivel</th>
                    <th>Minima</th>
                    <th className="text-end">Acoes</th>
                  </tr>
                </thead>
                <tbody>
                  {itens.map((item) => (
                    <tr key={item.id}>
                      <td>{item.nome}</td>
                      <td>{item.tipo}</td>
                      <td>{Number(item.quantidade).toFixed(2)}</td>
                      <td>{Number(item.quantidade_minima).toFixed(2)}</td>
                      <td className="text-end">
                        <button className="btn btn-sm btn-outline-primary me-2" type="button" onClick={() => handleEdit(item)}>Editar</button>
                        <button className="btn btn-sm btn-outline-danger" type="button" onClick={() => handleDelete(item)}>Excluir</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
