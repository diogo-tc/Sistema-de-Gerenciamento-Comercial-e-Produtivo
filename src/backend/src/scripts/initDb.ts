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
  await connection.query(`
    CREATE TABLE IF NOT EXISTS clientes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(120) NOT NULL,
      cpf VARCHAR(20) NOT NULL UNIQUE,
      telefone VARCHAR(30) NOT NULL,
      endereco VARCHAR(255),
      criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await connection.query(`
    CREATE TABLE IF NOT EXISTS fornecedores (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(120) NOT NULL,
      cnpj VARCHAR(20) NOT NULL UNIQUE,
      contato VARCHAR(120) NOT NULL,
      produtos_fornecidos VARCHAR(255),
      criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await connection.query(`
    CREATE TABLE IF NOT EXISTS unidades (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(120) NOT NULL,
      endereco VARCHAR(255) NOT NULL,
      responsavel VARCHAR(120) NOT NULL,
      criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await connection.query(`
    CREATE TABLE IF NOT EXISTS funcionarios (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(120) NOT NULL,
      cpf VARCHAR(20) NOT NULL UNIQUE,
      cargo VARCHAR(100) NOT NULL,
      salario DECIMAL(10,2) NOT NULL,
      data_admissao DATE,
      unidade_id INT NOT NULL,
      criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_funcionarios_unidades
        FOREIGN KEY (unidade_id) REFERENCES unidades(id)
    )
  `);
  await connection.query(`
    CREATE TABLE IF NOT EXISTS estoque (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(120) NOT NULL,
      tipo VARCHAR(60) NOT NULL,
      quantidade DECIMAL(10,2) NOT NULL DEFAULT 0,
      quantidade_minima DECIMAL(10,2) NOT NULL DEFAULT 0,
      validade DATE,
      criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await connection.query(`
    CREATE TABLE IF NOT EXISTS estoque_movimentacoes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      item_id INT NOT NULL,
      tipo ENUM('entrada', 'saida') NOT NULL,
      quantidade DECIMAL(10,2) NOT NULL,
      observacao VARCHAR(255),
      criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_movimentacoes_estoque
        FOREIGN KEY (item_id) REFERENCES estoque(id)
        ON DELETE CASCADE
    )
  `);
  await connection.query(`
    CREATE TABLE IF NOT EXISTS faturamentos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      descricao VARCHAR(160) NOT NULL,
      valor DECIMAL(10,2) NOT NULL,
      data_faturamento DATE NOT NULL,
      forma_pagamento VARCHAR(80) NOT NULL,
      observacao VARCHAR(255),
      criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await connection.query(`
    CREATE TABLE IF NOT EXISTS equipamentos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(120) NOT NULL,
      tipo VARCHAR(80) NOT NULL,
      descricao VARCHAR(255),
      status VARCHAR(60) NOT NULL,
      criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await connection.query(`
    CREATE TABLE IF NOT EXISTS manutencoes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      equipamento_id INT NOT NULL,
      tipo VARCHAR(80) NOT NULL,
      data_manutencao DATE NOT NULL,
      responsavel_tecnico VARCHAR(120) NOT NULL,
      custo DECIMAL(10,2) NOT NULL DEFAULT 0,
      proxima_revisao DATE,
      observacao VARCHAR(255),
      criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_manutencoes_equipamentos
        FOREIGN KEY (equipamento_id) REFERENCES equipamentos(id)
        ON DELETE CASCADE
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
