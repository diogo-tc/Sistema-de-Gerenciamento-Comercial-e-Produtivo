import { Router } from "express";

import { checkDatabaseConnection } from "../config/database.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { modules } from "../services/modules.js";

export const systemRoutes = Router();

systemRoutes.get("/health", (_request, response) => {
  response.json({ ok: true, message: "Backend Express ativo." });
});

systemRoutes.get("/dashboard", requireAuth, async (_request, response) => {
  const database = await checkDatabaseConnection();

  response.json({
    database,
    totalModules: modules.length,
    sprint: "Sprint 2",
    scope: "Login, sessao, rotas protegidas, React, Express e integracao inicial com MySQL."
  });
});

systemRoutes.get("/modules", requireAuth, (_request, response) => {
  response.json({ modules });
});
