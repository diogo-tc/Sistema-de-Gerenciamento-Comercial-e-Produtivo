import express from "express";
import cors from "cors";
import session from "express-session";

import "./types.js";
import { config } from "./config/env.js";
import { authRoutes } from "./routes/authRoutes.js";
import { clientesRoutes } from "./routes/clientesRoutes.js";
import { estoqueRoutes } from "./routes/estoqueRoutes.js";
import { faturamentoRoutes } from "./routes/faturamentoRoutes.js";
import { fornecedoresRoutes } from "./routes/fornecedoresRoutes.js";
import { funcionariosRoutes } from "./routes/funcionariosRoutes.js";
import { manutencaoRoutes } from "./routes/manutencaoRoutes.js";
import { systemRoutes } from "./routes/systemRoutes.js";
import { unidadesRoutes } from "./routes/unidadesRoutes.js";

const app = express();

const allowedOrigins = new Set([
  config.clientUrl,
  "http://localhost:5173",
  "http://127.0.0.1:5173"
]);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origem nao permitida pelo CORS."));
    },
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
app.use("/api/faturamento", faturamentoRoutes);
app.use("/api/fornecedores", fornecedoresRoutes);
app.use("/api/funcionarios", funcionariosRoutes);
app.use("/api/manutencao", manutencaoRoutes);
app.use("/api/unidades", unidadesRoutes);
app.use("/api", systemRoutes);

app.listen(config.port, () => {
  console.log(`Backend rodando em http://localhost:${config.port}`);
});

