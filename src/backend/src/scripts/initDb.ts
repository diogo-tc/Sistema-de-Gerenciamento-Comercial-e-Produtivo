import { createServerConnection } from "../config/database.js";
import { config } from "../config/env.js";

async function initDatabase() {
  const connection = await createServerConnection();

  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${config.db.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  );
  await connection.query(`USE \`${config.db.database}\``);
  await connection.query(`
    CREATE TABLE IF NOT EXISTS sistema_info (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(100) NOT NULL UNIQUE,
      criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await connection.query(
    "INSERT IGNORE INTO sistema_info (nome) VALUES (?)",
    ["Sistema de Gerenciamento Comercial e Produtivo"]
  );

  await connection.end();
}

initDatabase()
  .then(() => console.log("Banco de dados inicializado com sucesso."))
  .catch((error: unknown) => {
    const message = error instanceof Error ? error.message : "Erro desconhecido";
    console.error(`Erro ao inicializar o banco: ${message}`);
    process.exit(1);
  });
