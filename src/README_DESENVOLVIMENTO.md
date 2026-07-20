# README de Desenvolvimento

Este documento explica como desenvolver, rodar e manter o projeto atual em TypeScript, React, Express e MySQL.

## Visao tecnica

O projeto foi reorganizado para substituir a versao Flask/Python por uma aplicacao em TypeScript. A pasta `src` concentra todo o codigo executavel, scripts de banco, documentacao tecnica e arquivos de configuracao.

A aplicacao esta dividida em duas partes:

- `backend`: API REST em Node.js, Express e TypeScript.
- `frontend`: interface web em React, TypeScript e Vite.

O banco usado e MySQL, com credenciais lidas por arquivo `.env`.

## Pre-requisitos

- Node.js instalado no WSL.
- npm instalado no WSL.
- MySQL instalado e em execucao.
- Usuario do MySQL com permissao para criar banco, criar tabelas e inserir dados.
- Terminal aberto na pasta correta do projeto.

Caminho recomendado pelo WSL:

```bash
cd /mnt/c/docsw/EngenhariaII/Sistema-de-Gerenciamento-Comercial-e-Produtivo/src
```

## Configuracao inicial

Instale as dependencias da raiz, do backend e do frontend:

```bash
npm install
npm run install:all
```

Crie ou confira o arquivo `.env` dentro da pasta `src`.

Modelo esperado:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha_do_mysql
DB_NAME=sistema_paes
SESSION_SECRET=sistema-paes-secret
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
CLIENT_URL=http://localhost:5173
PORT=3000
```

Importante: o `.env` guarda dados locais e nao deve ser enviado ao GitHub. O arquivo correto para subir como exemplo e o `.env.example`.

## Banco de dados

A estrutura das tabelas esta em `schema.sql` e tambem e usada pelo script de inicializacao.

Para criar o banco e as tabelas:

```bash
npm run init:db --prefix backend
```

Para testar a conexao:

```bash
npm run test:db --prefix backend
```

Para popular o banco com dados ficticios sem apagar dados existentes:

```bash
npm run seed:db --prefix backend
```

Para apagar os dados de demonstracao e popular novamente:

```bash
npm run seed:db:reset --prefix backend
```

Use o reset quando voce alterar o script de seed e quiser ver os novos dados aparecendo no sistema.

## Execucao em desenvolvimento

Para iniciar backend e frontend juntos:

```bash
npm run dev
```

Esse comando executa:

- Backend em `http://localhost:3000`
- Frontend em `http://localhost:5173`

Login padrao:

- Usuario: `admin`
- Senha: `admin123`

## Backend

Local: `backend/`

Arquivos principais:

- `backend/src/server.ts`: cria o servidor Express, configura CORS, JSON, sessao e registra as rotas.
- `backend/src/config/env.ts`: centraliza a leitura das variaveis do `.env`.
- `backend/src/config/database.ts`: cria o pool de conexao com MySQL e testa a conexao.
- `backend/src/middlewares/requireAuth.ts`: protege rotas que exigem login.
- `backend/src/services/modules.ts`: lista e organiza os modulos exibidos no sistema.
- `backend/src/routes/authRoutes.ts`: login, logout e verificacao de sessao.
- `backend/src/routes/systemRoutes.ts`: status da API, banco e modulos.
- `backend/src/routes/clientesRoutes.ts`: CRUD de clientes.
- `backend/src/routes/fornecedoresRoutes.ts`: CRUD de fornecedores.
- `backend/src/routes/unidadesRoutes.ts`: CRUD de unidades.
- `backend/src/routes/funcionariosRoutes.ts`: CRUD de funcionarios.
- `backend/src/routes/estoqueRoutes.ts`: produtos, entradas, saidas e movimentacoes.
- `backend/src/routes/faturamentoRoutes.ts`: registros de faturamento.
- `backend/src/routes/manutencaoRoutes.ts`: equipamentos e manutencoes.
- `backend/src/scripts/initDb.ts`: inicializacao do banco.
- `backend/src/scripts/testDb.ts`: teste de conexao.
- `backend/src/scripts/seedDb.ts`: carga de dados ficticios.

Padrao usado nas rotas:

- Validar dados obrigatorios antes de gravar.
- Usar consultas parametrizadas para evitar SQL injection.
- Retornar JSON para o frontend.
- Proteger rotas internas com `requireAuth`.

## Frontend

Local: `frontend/`

Arquivos principais:

- `frontend/src/main.tsx`: ponto de entrada do React.
- `frontend/src/App.tsx`: layout principal, estado de login, menu e rotas internas.
- `frontend/src/services/api.ts`: funcoes de chamada HTTP para o backend.
- `frontend/src/pages/LoginPage.tsx`: tela de login.
- `frontend/src/pages/DashboardPage.tsx`: dashboard inicial.
- `frontend/src/pages/ClientesPage.tsx`: tela de clientes.
- `frontend/src/pages/FornecedoresPage.tsx`: tela de fornecedores.
- `frontend/src/pages/UnidadesPage.tsx`: tela de unidades.
- `frontend/src/pages/FuncionariosPage.tsx`: tela de funcionarios.
- `frontend/src/pages/EstoquePage.tsx`: tela de estoque e movimentacoes.
- `frontend/src/pages/FaturamentoPage.tsx`: tela de faturamento.
- `frontend/src/pages/ManutencaoPage.tsx`: tela de equipamentos e manutencoes.
- `frontend/src/pages/ModulePage.tsx`: pagina generica/placeholder para modulos planejados.
- `frontend/src/styles.css`: ajustes visuais da interface.

O Bootstrap e carregado via CDN no HTML do frontend. Isso simplifica o projeto porque evita instalar e configurar o Bootstrap como dependencia local. Para este escopo academico, a abordagem por CDN e suficiente e direta.

## Fluxo de funcionamento

1. O usuario acessa `http://localhost:5173`.
2. O React mostra a tela de login.
3. O login chama a API do backend em `http://localhost:3000/api/auth/login`.
4. O backend compara usuario e senha com as variaveis do `.env`.
5. Se o login for valido, o backend cria uma sessao.
6. As telas internas passam a consultar as rotas protegidas da API.
7. As rotas do backend leem e gravam dados no MySQL.
8. O frontend atualiza as tabelas e formularios conforme as respostas da API.

## Erros comuns

### `failed to fetch` no login

Normalmente significa que o backend nao esta rodando ou que o frontend nao conseguiu acessar a API.

Confira:

```bash
npm run dev
```

E acesse o frontend por:

```text
http://localhost:5173
```

Tambem confirme se o backend apareceu no terminal em:

```text
http://localhost:3000
```

### `Access denied for user 'root'@'localhost'`

Significa que o usuario ou a senha do MySQL no `.env` nao conferem com o MySQL local.

Ajuste:

```env
DB_USER=root
DB_PASSWORD=sua_senha_do_mysql
```

Depois rode novamente:

```bash
npm run test:db --prefix backend
```

### Dados antigos continuam aparecendo

Use o seed com reset:

```bash
npm run seed:db:reset --prefix backend
```

Depois recarregue a pagina do navegador.

### `tsx: not found`

As dependencias do backend nao foram instaladas.

Rode na pasta `src`:

```bash
npm run install:all
```

### Erro de parse em `package.json`

Pode acontecer quando o arquivo foi salvo com codificacao inadequada. Os arquivos atuais devem ficar em UTF-8 sem BOM.

## Checklist antes de entregar

- Rodar `npm run install:all` em ambiente limpo.
- Conferir `.env` local.
- Rodar `npm run init:db --prefix backend`.
- Rodar `npm run seed:db:reset --prefix backend`.
- Rodar `npm run test:db --prefix backend`.
- Rodar `npm run dev`.
- Testar login com `admin` e `admin123`.
- Testar cadastro, edicao e remocao nos modulos principais.
- Testar entrada e saida de estoque.
- Testar bloqueio de estoque negativo.
- Conferir se o frontend abre em `http://localhost:5173`.

## Organizacao para proximas sprints

As proximas evolucoes devem seguir a estrutura atual:

- Criar ou ajustar tabela no `schema.sql`.
- Atualizar `initDb.ts` se a estrutura do banco mudar.
- Criar rota no backend dentro de `backend/src/routes`.
- Registrar a rota em `backend/src/server.ts`.
- Criar funcoes de API em `frontend/src/services/api.ts`.
- Criar ou atualizar pagina em `frontend/src/pages`.
- Atualizar o menu/modulos quando necessario.
- Atualizar `API.md`, `TESTES.md`, `README.md` e este README de desenvolvimento.

## Arquivos que nao devem ir para o GitHub

- `.env`
- `node_modules/`
- `dist/`
- arquivos temporarios do sistema operacional
- logs locais

O `.env.example` deve ir para o GitHub, pois ele documenta quais variaveis o projeto precisa sem expor credenciais reais.