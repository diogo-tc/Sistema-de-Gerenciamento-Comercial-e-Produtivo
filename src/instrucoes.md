# Instrucoes para rodar

## Pelo WSL

Entre na pasta do projeto:

```bash
cd /mnt/c/docsw/EngenhariaII/Sistema-de-Gerenciamento-Comercial-e-Produtivo/src
```

Instale as dependencias:

```bash
npm install
npm run install:all
```

Inicialize o banco:

```bash
npm run init:db --prefix backend
```

Popule o banco com dados ficticios:

```bash
npm run seed:db --prefix backend
```

Se o banco ja tiver dados antigos e voce quiser substituir pela base ficticia completa:

```bash
npm run seed:db:reset --prefix backend
```

Teste a conexao:

```bash
npm run test:db --prefix backend
```

Rode o sistema:

```bash
npm run dev
```

Acesse:

```text
http://localhost:5173
```

Login:

```text
Usuario: admin
Senha: admin123
```

## Observacoes

- O MySQL precisa estar rodando antes do `init:db`.
- O comando `seed:db` preenche apenas tabelas vazias e nao apaga dados existentes.
- O comando `seed:db:reset` limpa as tabelas de demonstracao e popula tudo novamente.
- O seed inclui dados ficticios de clientes, fornecedores, unidades, funcionarios, estoque, faturamentos, equipamentos e manutencoes.
- O arquivo `.env` deve conter as configuracoes de banco.
- Nao envie `.env`, `node_modules`, `backend/dist` ou `frontend/dist` para o GitHub.
