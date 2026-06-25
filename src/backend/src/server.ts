import express from "express";
import cors from "cors";
import session from "express-session";

import "../../../../../Sistema-de-Gerenciamento-Comercial-e-Produtivo/src/backend/src/types.js";
import { config } from "../../../../../Sistema-de-Gerenciamento-Comercial-e-Produtivo/src/backend/src/config/env.js";
import { authRoutes } from "../../../../../Sistema-de-Gerenciamento-Comercial-e-Produtivo/src/backend/src/routes/authRoutes.js";
import { clientesRoutes } from "../../../../../Sistema-de-Gerenciamento-Comercial-e-Produtivo/src/backend/src/routes/clientesRoutes.js";
import { estoqueRoutes } from "../../../../../Sistema-de-Gerenciamento-Comercial-e-Produtivo/src/backend/src/routes/estoqueRoutes.js";
import { fornecedoresRoutes } from "../../../../../Sistema-de-Gerenciamento-Comercial-e-Produtivo/src/backend/src/routes/fornecedoresRoutes.js";
import { funcionariosRoutes } from "../../../../../Sistema-de-Gerenciamento-Comercial-e-Produtivo/src/backend/src/routes/funcionariosRoutes.js";
import { systemRoutes } from "../../../../../Sistema-de-Gerenciamento-Comercial-e-Produtivo/src/backend/src/routes/systemRoutes.js";
import { unidadesRoutes } from "../../../../../Sistema-de-Gerenciamento-Comercial-e-Produtivo/src/backend/src/routes/unidadesRoutes.js";

const app = express();

app.use(
  cors({
    origin: config.clientUrl,
    credentials: true
  })
);
app.use(express.json());
app.use(
  session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: false
    }
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/clientes", clientesRoutes);
app.use("/api/estoque", estoqueRoutes);
app.use("/api/fornecedores", fornecedoresRoutes);
app.use("/api/funcionarios", funcionariosRoutes);
app.use("/api/unidades", unidadesRoutes);
app.use("/api", systemRoutes);

app.listen(config.port, () => {
  console.log(`Backend rodando em http://localhost:${config.port}`);
});
