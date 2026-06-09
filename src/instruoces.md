# Instrucoes para rodar o sistema

## 1. Entrar na pasta do projeto

Abra o PowerShell e rode:

```powershell
cd C:\docsw\EngenhariaII\Sistema-de-Gerenciamento-Comercial-e-Produtivo\src
```

## 2. Criar o ambiente virtual

```powershell
python -m venv .venv
```

## 3. Ativar o ambiente virtual

```powershell
.\.venv\Scripts\Activate.ps1
```

Se aparecer erro dizendo que a execucao de scripts esta desabilitada, rode:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Quando pedir confirmacao, digite:

```text
S
```

Depois tente ativar novamente:

```powershell
.\.venv\Scripts\Activate.ps1
```

Quando estiver ativado, o terminal deve aparecer com `(.venv)` no inicio da linha.

## 4. Atualizar o pip

```powershell
python -m pip install --upgrade pip
```

## 5. Instalar as dependencias

```powershell
python -m pip install -r requirements.txt
```

## 6. Inicializar o banco de dados

Antes de rodar o sistema, confira se o MySQL esta aberto e se os dados do arquivo `.env` estao corretos.

Depois rode:

```powershell
python init_db.py
```

Se tudo estiver certo, deve aparecer:

```text
Banco de dados inicializado com sucesso.
```

## 7. Testar a conexao com o MySQL

```powershell
python test_db.py
```

Se tudo estiver certo, deve aparecer:

```text
Conexao com MySQL realizada com sucesso.
```

## 8. Rodar o sistema

```powershell
python -m flask run
```

O terminal deve mostrar algo parecido com:

```text
Running on http://127.0.0.1:5000
```

Deixe esse PowerShell aberto enquanto estiver usando o sistema.

## 9. Acessar no navegador

Abra o navegador e acesse:

```text
http://127.0.0.1:5000
```

## Login inicial

```text
Usuario: admin
Senha: admin123
```

## Caso a conexao seja recusada

Confira se o Flask ainda esta rodando no PowerShell. Se precisar, pare com `CTRL+C` e rode novamente:

```powershell
python -m flask run --host=0.0.0.0 --port=5000
```

Depois acesse:

```text
http://localhost:5000
```
