import mysql from "mysql2/promise";

import { config } from "./env.js";

export const pool = mysql.createPool({
  ...config.db,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export async function checkDatabaseConnection() {
  try {
    const connection = await pool.getConnection();
    connection.release();
    return { ok: true, message: "Conexao com MySQL realizada com sucesso." };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro desconhecido";
    return { ok: false, message: `Nao foi possivel conectar ao MySQL: ${message}` };
  }
}

export async function createServerConnection() {
  return mysql.createConnection({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password
  });
}
