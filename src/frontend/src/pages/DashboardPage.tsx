import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { api, DashboardInfo, ModuleInfo } from "../services/api";

export function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardInfo | null>(null);
  const [modules, setModules] = useState<ModuleInfo[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api.dashboard(), api.modules()])
      .then(([dashboardData, modulesData]) => {
        setDashboard(dashboardData);
        setModules(modulesData.modules);
      })
      .catch((apiError) => {
        setError(apiError instanceof Error ? apiError.message : "Nao foi possivel carregar o painel.");
      });
  }, []);

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!dashboard) {
    return <div className="alert alert-info">Carregando painel...</div>;
  }

  return (
    <>
      <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
        <div>
          <h1 className="h3 mb-1">Painel administrativo</h1>
          <p className="text-secondary mb-0">Base inicial do sistema para gerenciamento comercial e produtivo.</p>
        </div>
        <div className="text-md-end">
          <span className="badge text-bg-primary">{dashboard.totalModules} modulos previstos</span>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-lg-6">
          <div className="card h-100">
            <div className="card-body">
              <h2 className="h5">Status do banco de dados</h2>
              <p className={`mb-0 text-${dashboard.database.ok ? "success" : "danger"}`}>
                {dashboard.database.message}
              </p>
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-6">
          <div className="card h-100">
            <div className="card-body">
              <h2 className="h5">{dashboard.sprint}</h2>
              <p className="mb-0 text-secondary">{dashboard.scope}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3">
        {modules.map((module) => (
          <div className="col-12 col-md-6 col-xl-4" key={module.endpoint}>
            <Link className="card module-card h-100 text-decoration-none" to={`/modulos/${module.endpoint}`}>
              <div className="card-body">
                <h2 className="h5 text-body">{module.title}</h2>
                <p className="text-secondary mb-0">{module.description}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
