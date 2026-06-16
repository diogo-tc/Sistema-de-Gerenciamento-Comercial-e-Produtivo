import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { api, ModuleInfo } from "../services/api";

export function ModulePage() {
  const { endpoint } = useParams();
  const [module, setModule] = useState<ModuleInfo | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.modules()
      .then(({ modules }) => {
        setModule(modules.find((item) => item.endpoint === endpoint) ?? null);
      })
      .catch((apiError) => {
        setError(apiError instanceof Error ? apiError.message : "Nao foi possivel carregar o modulo.");
      });
  }, [endpoint]);

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!module) {
    return <div className="alert alert-warning">Modulo nao encontrado.</div>;
  }

  return (
    <>
      <div className="mb-4">
        <h1 className="h3 mb-1">{module.title}</h1>
        <p className="text-secondary mb-0">{module.description}</p>
      </div>

      <div className="card">
        <div className="card-body">
          <h2 className="h5">Modulo reservado para proxima sprint</h2>
          <p className="mb-0 text-secondary">
            Esta tela ja esta conectada ao menu principal e protegida por login. As operacoes de cadastro, edicao,
            exclusao e consulta serao adicionadas nas proximas etapas.
          </p>
        </div>
      </div>
    </>
  );
}
