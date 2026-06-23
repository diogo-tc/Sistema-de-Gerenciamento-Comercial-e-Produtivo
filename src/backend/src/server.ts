import express from "express";
import cors from "cors";
import session from "express-session";

import "./types.js";
import { config } from "./config/env.js";
import { authRoutes } from "./routes/authRoutes.js";
import { clientesRoutes } from "./routes/clientesRoutes.js";
import { estoqueRoutes } from "./routes/estoqueRoutes.js";
import { fornecedoresRoutes } from "./routes/fornecedoresRoutes.js";
import { funcionariosRoutes } from "./routes/funcionariosRoutes.js";
import { systemRoutes } from "./routes/systemRoutes.js";
import { unidadesRoutes } from "./routes/unidadesRoutes.js";

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
