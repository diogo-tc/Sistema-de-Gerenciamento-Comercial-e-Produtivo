# Sistema de Gerenciamento Comercial e Produtivo

Aplicacao web para gerenciamento administrativo de uma empresa de producao de alimentos, com foco inicial em uma empresa de paes artesanais.

A implementacao atual corresponde a Sprint 2, agora reescrita com TypeScript, substituindo a versao anterior em Flask/Python.

## Stack atual

- Node.js
- Express
- TypeScript
- React
- Vite
- Bootstrap via CDN
- MySQL
- dotenv
- express-session
- mysql2

## O que ja foi feito

- Estrutura do backend em Node.js + Express + TypeScript.
- Estrutura do frontend em React + TypeScript + Vite.
- Login do gerente com usuario e senha configuraveis por `.env`.
- Sessao de usuario autenticado usando `express-session`.
- Rotas protegidas no backend.
- Dashboard administrativo no frontend.
- Status da conexao com MySQL exibido no dashboard.
- Menu principal com modulos previstos para as proximas sprints.
- Paginas placeholder para Clientes, Fornecedores, Estoque, Funcionarios, Unidades, Faturamento e Manutencao.
- Configuracao do banco via `.env`.
- Script para inicializar o banco de dados.
- Script para testar a conexao com o MySQL.
- Documentacao de execucao pelo WSL em `instruoces.md`.

## Credenciais iniciais

```text
Usuario: admin
Senha: admin123
```

As credenciais podem ser alteradas no arquivo `.env`:

```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

## Estrutura de arquivos

### Arquivos da raiz de `src`

| Arquivo | Explicacao |
|---|---|
| `.env` | Configuracoes locais do projeto, como porta do backend, segredo da sessao, credenciais do login e dados de conexao com MySQL. |
| `.env.example` | Modelo de configuracao para orientar quais variaveis devem existir no `.env`. |
| `.gitignore` | Define arquivos e pastas que nao devem ser versionados, como `node_modules`, `.env` e `dist`. |
| `package.json` | Arquivo principal de scripts da aplicacao. Permite instalar dependencias, rodar backend e frontend juntos e executar build. |
| `package-lock.json` | Registra as versoes exatas das dependencias instaladas na raiz. |
| `schema.sql` | Script SQL com a criacao inicial do banco `sistema_paes` e da tabela `sistema_info`. |
| `README.md` | Documentacao geral do que foi implementado e explicacao dos arquivos. |
| `instruoces.md` | Passo a passo para rodar o projeto pelo WSL. |

### Backend

| Arquivo | Explicacao |
|---|---|
| `backend/package.json` | Dependencias e scripts do backend, incluindo `dev`, `build`, `start`, `init:db` e `test:db`. |
| `backend/tsconfig.json` | Configuracao do TypeScript para compilar o backend. |
| `backend/src/server.ts` | Arquivo principal do backend. Configura Express, CORS, JSON, sessao e registra as rotas da API. |
| `backend/src/types.ts` | Extende os tipos da sessao do Express para reconhecer `authenticated` e `username`. |
| `backend/src/config/env.ts` | Carrega as variaveis do `.env` e centraliza as configuracoes do sistema. |
| `backend/src/config/database.ts` | Configura o pool de conexoes MySQL e fornece funcoes para testar conexao e conectar ao servidor MySQL. |
| `backend/src/middlewares/requireAuth.ts` | Middleware que bloqueia acesso a rotas protegidas quando o usuario nao esta autenticado. |
| `backend/src/routes/authRoutes.ts` | Rotas de autenticacao: verificar sessao, login e logout. |
| `backend/src/routes/systemRoutes.ts` | Rotas do sistema: health check, dashboard protegido e lista de modulos. |
| `backend/src/services/modules.ts` | Lista centralizada dos modulos previstos no sistema, usada pelo menu e dashboard. |
| `backend/src/scripts/initDb.ts` | Script que cria o banco `sistema_paes` e a tabela inicial `sistema_info`. |
| `backend/src/scripts/testDb.ts` | Script que testa se a conexao com o MySQL esta funcionando. |

### Frontend

| Arquivo | Explicacao |
|---|---|
| `frontend/package.json` | Dependencias e scripts do frontend React, incluindo `dev`, `build` e `preview`. |
| `frontend/tsconfig.json` | Configuracao do TypeScript para o frontend. |
| `frontend/vite.config.ts` | Configuracao do Vite, usado para rodar e empacotar o frontend. |
| `frontend/index.html` | HTML principal carregado pelo Vite. Inclui Bootstrap via CDN e o ponto de montagem do React. |
| `frontend/src/main.tsx` | Entrada principal do React. Renderiza a aplicacao dentro do elemento `root`. |
| `frontend/src/App.tsx` | Define as rotas do frontend, protege paginas autenticadas, cria o layout com navbar e controla login/logout. |
| `frontend/src/pages/LoginPage.tsx` | Tela de login do gerente. Envia usuario e senha para a API. |
| `frontend/src/pages/DashboardPage.tsx` | Tela inicial apos login. Mostra status do banco, escopo da Sprint 2 e cards dos modulos. |
| `frontend/src/pages/ModulePage.tsx` | Tela placeholder para cada modulo futuro. |
| `frontend/src/services/api.ts` | Centraliza as chamadas HTTP do frontend para o backend Express. |
| `frontend/src/styles.css` | Estilos adicionais do frontend, complementando o Bootstrap. |

## Pastas geradas automaticamente

| Pasta | Explicacao |
|---|---|
| `node_modules/` | Dependencias instaladas pelo npm. Nao deve ser editada manualmente. |
| `backend/dist/` | Arquivos JavaScript gerados quando o backend e compilado com `npm run build --prefix backend`. |
| `frontend/dist/` | Arquivos finais do frontend gerados quando o frontend e compilado com `npm run build --prefix frontend`. |

## Modulos preparados para proximas sprints

- Clientes
- Fornecedores
- Estoque
- Funcionarios
- Unidades
- Faturamento
- Manutencao

Nesta Sprint 2, esses modulos ainda sao placeholders. Os CRUDs e regras de negocio entram nas proximas sprints.

## Como rodar

O passo a passo completo esta em:

```text
instruoces.md
```