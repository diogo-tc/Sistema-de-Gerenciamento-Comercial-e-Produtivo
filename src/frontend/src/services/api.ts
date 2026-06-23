export type ModuleInfo = {
  endpoint: string;
  title: string;
  description: string;
};

export type DashboardInfo = {
  database: {
    ok: boolean;
    message: string;
  };
  totalModules: number;
  sprint: string;
  scope: string;
};

export type Cliente = {
  id: number;
  nome: string;
  cpf: string;
  telefone: string;
  endereco: string | null;
};

export type ClienteInput = Omit<Cliente, "id">;

export type Fornecedor = {
  id: number;
  nome: string;
  cnpj: string;
  contato: string;
  produtos_fornecidos: string | null;
};

export type FornecedorInput = Omit<Fornecedor, "id">;

export type Unidade = {
  id: number;
  nome: string;
  endereco: string;
  responsavel: string;
};

export type UnidadeInput = Omit<Unidade, "id">;

export type Funcionario = {
  id: number;
  nome: string;
  cpf: string;
  cargo: string;
  salario: number;
  data_admissao: string | null;
  unidade_id: number;
  unidade_nome: string;
};

export type FuncionarioInput = Omit<Funcionario, "id" | "unidade_nome" | "salario"> & {
  salario: number | string;
};

export type ItemEstoque = {
  id: number;
  nome: string;
  tipo: string;
  quantidade: number;
  quantidade_minima: number;
  validade: string | null;
};

export type ItemEstoqueInput = Omit<ItemEstoque, "id" | "quantidade" | "quantidade_minima"> & {
  quantidade_minima: number | string;
};

export type MovimentacaoEstoque = {
  id: number;
  item_id: number;
  item_nome: string;
  tipo: "entrada" | "saida";
  quantidade: number;
  observacao: string | null;
  criado_em: string;
};

export type MovimentacaoInput = {
  item_id: number | string;
  tipo: "entrada" | "saida";
  quantidade: number | string;
  observacao: string | null;
};

const API_URL = "http://localhost:3000/api";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    },
    ...options
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({ message: "Erro na requisicao." }));
    throw new Error(data.message ?? "Erro na requisicao.");
  }

  return response.json() as Promise<T>;
}

export const api = {
  me: () => request<{ authenticated: boolean; username?: string }>("/auth/me"),
  login: (username: string, password: string) =>
    request<{ message: string; username: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password })
    }),
  logout: () => request<{ message: string }>("/auth/logout", { method: "POST" }),
  dashboard: () => request<DashboardInfo>("/dashboard"),
  modules: () => request<{ modules: ModuleInfo[] }>("/modules"),
  clientes: {
    list: () => request<{ clientes: Cliente[] }>("/clientes"),
    create: (cliente: ClienteInput) =>
      request<{ message: string; id: number }>("/clientes", {
        method: "POST",
        body: JSON.stringify(cliente)
      }),
    update: (id: number, cliente: ClienteInput) =>
      request<{ message: string }>(`/clientes/${id}`, {
        method: "PUT",
        body: JSON.stringify(cliente)
      }),
    remove: (id: number) => request<{ message: string }>(`/clientes/${id}`, { method: "DELETE" })
  },
  fornecedores: {
    list: () => request<{ fornecedores: Fornecedor[] }>("/fornecedores"),
    create: (fornecedor: FornecedorInput) =>
      request<{ message: string; id: number }>("/fornecedores", {
        method: "POST",
        body: JSON.stringify(fornecedor)
      }),
    update: (id: number, fornecedor: FornecedorInput) =>
      request<{ message: string }>(`/fornecedores/${id}`, {
        method: "PUT",
        body: JSON.stringify(fornecedor)
      }),
    remove: (id: number) => request<{ message: string }>(`/fornecedores/${id}`, { method: "DELETE" })
  },
  unidades: {
    list: () => request<{ unidades: Unidade[] }>("/unidades"),
    create: (unidade: UnidadeInput) =>
      request<{ message: string; id: number }>("/unidades", {
        method: "POST",
        body: JSON.stringify(unidade)
      }),
    update: (id: number, unidade: UnidadeInput) =>
      request<{ message: string }>(`/unidades/${id}`, {
        method: "PUT",
        body: JSON.stringify(unidade)
      }),
    remove: (id: number) => request<{ message: string }>(`/unidades/${id}`, { method: "DELETE" })
  },
  funcionarios: {
    list: () => request<{ funcionarios: Funcionario[] }>("/funcionarios"),
    create: (funcionario: FuncionarioInput) =>
      request<{ message: string; id: number }>("/funcionarios", {
        method: "POST",
        body: JSON.stringify(funcionario)
      }),
    update: (id: number, funcionario: FuncionarioInput) =>
      request<{ message: string }>(`/funcionarios/${id}`, {
        method: "PUT",
        body: JSON.stringify(funcionario)
      }),
    remove: (id: number) => request<{ message: string }>(`/funcionarios/${id}`, { method: "DELETE" })
  },
  estoque: {
    list: () => request<{ itens: ItemEstoque[] }>("/estoque"),
    create: (item: ItemEstoqueInput) =>
      request<{ message: string; id: number }>("/estoque", {
        method: "POST",
        body: JSON.stringify(item)
      }),
    update: (id: number, item: ItemEstoqueInput) =>
      request<{ message: string }>(`/estoque/${id}`, {
        method: "PUT",
        body: JSON.stringify(item)
      }),
    remove: (id: number) => request<{ message: string }>(`/estoque/${id}`, { method: "DELETE" }),
    movements: () => request<{ movimentacoes: MovimentacaoEstoque[] }>("/estoque/movimentacoes"),
    move: (movimentacao: MovimentacaoInput) =>
      request<{ message: string }>("/estoque/movimentacoes", {
        method: "POST",
        body: JSON.stringify(movimentacao)
      })
  }
};
