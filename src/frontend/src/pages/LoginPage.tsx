import { FormEvent, useState } from "react";
import { Navigate } from "react-router-dom";

import { api } from "../services/api";

type LoginPageProps = {
  authenticated: boolean;
  onLogin: (username: string) => void;
};

export function LoginPage({ authenticated, onLogin }: LoginPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (authenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await api.login(username, password);
      onLogin(result.username);
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : "Nao foi possivel entrar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container login-wrapper d-flex align-items-center justify-content-center py-4">
      <div className="card shadow-sm login-card">
        <div className="card-body p-4">
          <h1 className="h4 mb-2">Acesso do gerente</h1>
          <p className="text-secondary mb-4">Entre para acessar as funcionalidades administrativas.</p>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label" htmlFor="username">Usuario</label>
              <input
                className="form-control"
                id="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                autoComplete="username"
                required
                autoFocus
              />
            </div>
            <div className="mb-4">
              <label className="form-label" htmlFor="password">Senha</label>
              <input
                className="form-control"
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
            <button className="btn btn-primary w-100" disabled={loading} type="submit">
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
