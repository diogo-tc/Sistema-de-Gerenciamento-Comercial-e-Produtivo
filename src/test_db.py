from dotenv import load_dotenv

from db import check_connection


if __name__ == "__main__":
    load_dotenv()
    ok, message = check_connection()
    print(message)
    raise SystemExit(0 if ok else 1)
