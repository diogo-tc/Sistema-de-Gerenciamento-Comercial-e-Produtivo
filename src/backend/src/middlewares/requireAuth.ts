import type { Request, Response, NextFunction } from "express";

export function requireAuth(request: Request, response: Response, next: NextFunction) {
  if (!request.session.authenticated) {
    return response.status(401).json({ message: "Acesso restrito. Faca login para continuar." });
  }

  return next();
}
