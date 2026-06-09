# Sprint 2 - Estrutura Base do Sistema

Esta pasta contem a base Flask do sistema, com login do gerente, rotas protegidas, layout Bootstrap, navegacao principal e integracao inicial com MySQL.

## Credenciais iniciais

- Usuario: `admin`
- Senha: `admin123`

As credenciais podem ser alteradas no arquivo `.env`.

## Preparar o ambiente

No terminal, dentro da pasta `src`, instale as dependencias:

```powershell
pip install -r requirements.txt
```

## Configurar o banco

1. Abra o MySQL.
2. Execute o arquivo `schema.sql`.
3. Ajuste usuario, senha, host e nome do banco no arquivo `.env`, se necessario.

## Executar o sistema

Dentro da pasta `src`, rode:

```powershell
flask run
```

Depois acesse:

```text
http://127.0.0.1:5000
```

## Modulos preparados no menu

- Clientes
- Fornecedores
- Estoque
- Funcionarios
- Unidades
- Faturamento
- Manutencao

Nesta sprint, esses modulos ficam como paginas reservadas para as proximas entregas.
