from dotenv import load_dotenv

from db import get_db_config, get_server_config

import mysql.connector


def init_database():
    load_dotenv()
    db_name = get_db_config()["database"]

    connection = mysql.connector.connect(**get_server_config())
    cursor = connection.cursor()

    cursor.execute(
        f"CREATE DATABASE IF NOT EXISTS `{db_name}` "
        "CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
    )
    cursor.execute(f"USE `{db_name}`")
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS sistema_info (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nome VARCHAR(100) NOT NULL UNIQUE,
            criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    cursor.execute(
        """
        INSERT IGNORE INTO sistema_info (nome)
        VALUES ('Sistema de Gerenciamento Comercial e Produtivo')
        """
    )

    connection.commit()
    cursor.close()
    connection.close()


if __name__ == "__main__":
    init_database()
    print("Banco de dados inicializado com sucesso.")
