CREATE DATABASE IF NOT EXISTS sistema_paes
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE sistema_paes;

CREATE TABLE IF NOT EXISTS sistema_info (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO sistema_info (nome)
SELECT 'Sistema de Gerenciamento Comercial e Produtivo'
WHERE NOT EXISTS (
  SELECT 1 FROM sistema_info WHERE nome = 'Sistema de Gerenciamento Comercial e Produtivo'
);
