import { Router } from "express";

import { config } from "../config/env.js";

export const authRoutes = Router();

authRoutes.get("/me", (request, response) => {
  if (!request.session.authenticated) {
    return response.status(401).json({ authenticated: false });
  }

  return response.json({
    authenticated: true,
    username: request.session.username
  });
});

authRoutes.post("/login", (request, response) => {
  const { username, password } = request.body as { username?: string; password?: string };

  if (username === config.adminUsername && password === config.adminPassword) {
    request.session.authenticated = true;
    request.session.username = username;
    return response.json({ message: "Login realizado com sucesso.", username });
  }

  return response.status(401).json({ message: "Usuario ou senha invalidos." });
});

authRoutes.post("/logout", (request, response) => {
  request.session.destroy((error) => {
    if (error) {
      return response.status(500).json({ message: "Nao foi possivel encerrar a sessao." });
    }

    response.clearCookie("connect.sid");
    return response.json({ message: "Sessao encerrada com sucesso." });
  });
});
