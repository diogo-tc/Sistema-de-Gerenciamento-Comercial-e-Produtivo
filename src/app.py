import os
from functools import wraps

from dotenv import load_dotenv
from flask import Flask, flash, redirect, render_template, request, session, url_for

from db import check_connection


load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY", "dev-secret-key")


MODULES = [
    {
        "endpoint": "clientes",
        "title": "Clientes",
        "description": "Cadastro, consulta e historico comercial dos clientes.",
    },
    {
        "endpoint": "fornecedores",
        "title": "Fornecedores",
        "description": "Organizacao dos parceiros e materias-primas fornecidas.",
    },
    {
        "endpoint": "estoque",
        "title": "Estoque",
        "description": "Controle de produtos, insumos, entradas, saidas e quantidades.",
    },
    {
        "endpoint": "funcionarios",
        "title": "Funcionarios",
        "description": "Cadastro de colaboradores, cargos, salarios e unidades.",
    },
    {
        "endpoint": "unidades",
        "title": "Unidades",
        "description": "Gerenciamento das unidades da empresa e seus responsaveis.",
    },
    {
        "endpoint": "faturamento",
        "title": "Faturamento",
        "description": "Registro basico das informacoes financeiras das vendas.",
    },
    {
        "endpoint": "manutencao",
        "title": "Manutencao",
        "description": "Controle de maquinas, equipamentos e manutencoes realizadas.",
    },
]


def login_required(view):
    @wraps(view)
    def wrapped_view(*args, **kwargs):
        if not session.get("authenticated"):
            flash("Faca login para acessar o sistema.", "warning")
            return redirect(url_for("login"))
        return view(*args, **kwargs)

    return wrapped_view


@app.context_processor
def inject_modules():
    return {"modules": MODULES}


@app.route("/", methods=["GET"])
def index():
    if session.get("authenticated"):
        return redirect(url_for("dashboard"))
    return redirect(url_for("login"))


@app.route("/login", methods=["GET", "POST"])
def login():
    if session.get("authenticated"):
        return redirect(url_for("dashboard"))

    if request.method == "POST":
        username = request.form.get("username", "").strip()
        password = request.form.get("password", "")

        admin_username = os.getenv("ADMIN_USERNAME", "admin")
        admin_password = os.getenv("ADMIN_PASSWORD", "admin123")

        if username == admin_username and password == admin_password:
            session.clear()
            session["authenticated"] = True
            session["username"] = username
            flash("Login realizado com sucesso.", "success")
            return redirect(url_for("dashboard"))

        flash("Usuario ou senha invalidos.", "danger")

    return render_template("login.html")


@app.route("/logout", methods=["POST"])
@login_required
def logout():
    session.clear()
    flash("Sessao encerrada com sucesso.", "info")
    return redirect(url_for("login"))


@app.route("/dashboard", methods=["GET"])
@login_required
def dashboard():
    db_ok, db_message = check_connection()
    return render_template(
        "dashboard.html",
        db_ok=db_ok,
        db_message=db_message,
        total_modules=len(MODULES),
    )


@app.route("/clientes")
@login_required
def clientes():
    return render_template("placeholder.html", module=get_module("clientes"))


@app.route("/fornecedores")
@login_required
def fornecedores():
    return render_template("placeholder.html", module=get_module("fornecedores"))


@app.route("/estoque")
@login_required
def estoque():
    return render_template("placeholder.html", module=get_module("estoque"))


@app.route("/funcionarios")
@login_required
def funcionarios():
    return render_template("placeholder.html", module=get_module("funcionarios"))


@app.route("/unidades")
@login_required
def unidades():
    return render_template("placeholder.html", module=get_module("unidades"))


@app.route("/faturamento")
@login_required
def faturamento():
    return render_template("placeholder.html", module=get_module("faturamento"))


@app.route("/manutencao")
@login_required
def manutencao():
    return render_template("placeholder.html", module=get_module("manutencao"))


def get_module(endpoint):
    return next(module for module in MODULES if module["endpoint"] == endpoint)


if __name__ == "__main__":
    app.run(debug=True)
