import os

import mysql.connector
from mysql.connector import Error


def get_db_config():
    return {
        "host": os.getenv("DB_HOST", "localhost"),
        "port": int(os.getenv("DB_PORT", "3306")),
        "user": os.getenv("DB_USER", "root"),
        "password": os.getenv("DB_PASSWORD", ""),
        "database": os.getenv("DB_NAME", "sistema_paes"),
    }


def get_server_config():
    config = get_db_config()
    config.pop("database", None)
    return config


def get_connection():
    return mysql.connector.connect(**get_db_config())


def check_connection():
    try:
        connection = get_connection()
        connection.close()
        return True, "Conexao com MySQL realizada com sucesso."
    except Error as error:
        return False, f"Nao foi possivel conectar ao MySQL: {error}"
