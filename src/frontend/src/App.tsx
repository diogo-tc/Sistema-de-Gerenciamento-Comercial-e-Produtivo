import { ReactNode, useEffect, useState } from "react";
import { Link, Navigate, Route, Routes, useNavigate } from "react-router-dom";

import { api, ModuleInfo } from "./services/api";
import { ClientesPage } from "./pages/ClientesPage";
import { DashboardPage } from "./pages/DashboardPage";
import { EstoquePage } from "./pages/EstoquePage";
import { FaturamentoPage } from "./pages/FaturamentoPage";
import { FornecedoresPage } from "./pages/FornecedoresPage";
import { FuncionariosPage } from "./pages/FuncionariosPage";
import { LoginPage } from "./pages/LoginPage";
import { ManutencaoPage } from "./pages/ManutencaoPage";
import { ModulePage } from "./pages/ModulePage";
import { UnidadesPage } from "./pages/UnidadesPage";

type ProtectedProps = {
  authenticated: boolean;
  children: ReactNode;
};

function ProtectedRoute({ authenticated, children }: ProtectedProps) {
  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function AppLayout({ children, onLogout }: { children: ReactNode; onLogout: () => void }) {
  const [modules, setModules] = useState<ModuleInfo[]>([]);

  useEffect(() => {
    api.modules().then((data) => setModules(data.modules)).catch(() => setModules([]));
  }, []);

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <Link className="navbar-brand fw-semibold" to="/dashboard">Gerenciamento</Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNavbar"
            aria-controls="mainNavbar"
            aria-expanded="false"
            aria-label="Abrir navegacao"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="mainNavbar">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/dashboard">Inicio</Link>
              </li>
              {modules.map((module) => (
                <li className="nav-item" key={module.endpoint}>
                  <Link className="nav-link" to={`/modulos/${module.endpoint}`}>{module.title}</Link>
                </li>
              ))}
            </ul>
            <button className="btn btn-outline-light btn-sm" onClick={onLogout} type="button">Sair</button>
          </div>
        </div>
      </nav>
      <main className="container py-4">{children}</main>
    </>
  );
}

export function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.me()
      .then((session) => setAuthenticated(session.authenticated))
      .catch(() => setAuthenticated(false))
      .finally(() => setCheckingSession(false));
  }, []);

  async function handleLogout() {
    await api.logout();
    setAuthenticated(false);
    navigate("/login");
  }

  if (checkingSession) {
    return <main className="container py-4"><div className="alert alert-info">Carregando sistema...</div></main>;
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage authenticated={authenticated} onLogin={() => {
        setAuthenticated(true);
        navigate("/dashboard");
      }} />} />
      <Route path="/" element={<Navigate to={authenticated ? "/dashboard" : "/login"} replace />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute authenticated={authenticated}>
            <AppLayout onLogout={handleLogout}>
              <DashboardPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/modulos/clientes"
        element={
          <ProtectedRoute authenticated={authenticated}>
            <AppLayout onLogout={handleLogout}>
              <ClientesPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/modulos/fornecedores"
        element={
          <ProtectedRoute authenticated={authenticated}>
            <AppLayout onLogout={handleLogout}>
              <FornecedoresPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/modulos/estoque"
        element={
          <ProtectedRoute authenticated={authenticated}>
            <AppLayout onLogout={handleLogout}>
              <EstoquePage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/modulos/funcionarios"
        element={
          <ProtectedRoute authenticated={authenticated}>
            <AppLayout onLogout={handleLogout}>
              <FuncionariosPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/modulos/unidades"
        element={
          <ProtectedRoute authenticated={authenticated}>
            <AppLayout onLogout={handleLogout}>
              <UnidadesPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/modulos/faturamento"
        element={
          <ProtectedRoute authenticated={authenticated}>
            <AppLayout onLogout={handleLogout}>
              <FaturamentoPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/modulos/manutencao"
        element={
          <ProtectedRoute authenticated={authenticated}>
            <AppLayout onLogout={handleLogout}>
              <ManutencaoPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/modulos/:endpoint"
        element={
          <ProtectedRoute authenticated={authenticated}>
            <AppLayout onLogout={handleLogout}>
              <ModulePage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
