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
  modules: () => request<{ modules: ModuleInfo[] }>("/modules")
};
