# Sistema de Gerenciamento Comercial e Produtivo

Sistema web para gerenciamento comercial e produtivo de uma empresa de producao de alimentos, com foco em paes artesanais. O projeto foi migrado para uma arquitetura em TypeScript, com backend em Node.js/Express, frontend em React e persistencia em MySQL.

## Objetivo do sistema

Centralizar os principais cadastros e operacoes administrativas da empresa, permitindo que o gerente acompanhe clientes, fornecedores, unidades, funcionarios, estoque, faturamento e manutencoes em uma unica interface web.

## Tecnologias utilizadas

- Node.js
- TypeScript
- Express
- React
- Vite
- MySQL
- Bootstrap via CDN
- dotenv para configuracao por arquivo `.env`
- express-session para controle de sessao
- mysql2 para conexao com o banco
- tsx para execucao dos arquivos TypeScript em desenvolvimento
- concurrently para iniciar frontend e backend juntos

## Funcionalidades implementadas

### Autenticacao

- Login de gerente.
- Sessao protegida no backend.
- Bloqueio de acesso aos modulos sem autenticacao.
- Credenciais configuradas via `.env`.

Credenciais padrao usadas no projeto:

- Usuario: `admin`
- Senha: `admin123`

### Dashboard

- Tela inicial apos login.
- Exibicao dos modulos do sistema.
- Verificacao basica de status da API e do banco.
- Menu com paginas ja preparadas para os modulos planejados nas sprints.

### Clientes

- Cadastro de clientes.
- Listagem de clientes.
- Edicao de clientes.
- Remocao de clientes.
- Dados ficticios disponiveis pelo script de seed.

### Fornecedores

- Cadastro de fornecedores.
- Listagem de fornecedores.
- Edicao de fornecedores.
- Remocao de fornecedores.
- Associacao com dados comerciais como contato, CNPJ e observacoes.

### Unidades

- Cadastro de unidades da empresa.
- Listagem de unidades.
- Edicao de unidades.
- Remocao de unidades.
- Uso das unidades como referencia para funcionarios, faturamentos e estoque.

### Funcionarios

- Cadastro de funcionarios.
- Vinculo obrigatorio com uma unidade.
- Listagem, edicao e remocao.
- Controle de cargo, contato e situacao.

### Estoque

- Cadastro de produtos e insumos.
- Controle de quantidade disponivel.
- Registro de entrada e saida.
- Bloqueio de saida quando a quantidade solicitada deixaria o estoque negativo.
- Historico de movimentacoes.

### Faturamento

- Registro de faturamentos por unidade.
- Controle de data, valor e descricao.
- Listagem dos lancamentos cadastrados.

### Manutencao

- Cadastro de equipamentos.
- Registro de manutencoes.
- Associacao de manutencoes com equipamentos.
- Controle de data, custo, status e descricao.

### Dados ficticios

Foi criado um script automatico para popular o banco com dados ficticios de demonstracao, incluindo:

- Clientes
- Fornecedores
- Unidades
- Funcionarios
- Produtos e insumos em estoque
- Movimentacoes de estoque
- Faturamentos
- Equipamentos
- Manutencoes

## Estrutura principal do projeto

```text
src/
  backend/
    src/
      config/
      middlewares/
      routes/
      scripts/
      services/
      server.ts
    package.json
    tsconfig.json
  frontend/
    src/
      pages/
      services/
      App.tsx
      main.tsx
      styles.css
    package.json
    tsconfig.json
    vite.config.ts
  .env
  .env.example
  .gitignore
  API.md
  README.md
  README_DESENVOLVIMENTO.md
  TESTES.md
  instrucoes.md
  package.json
  schema.sql
```

## Principais arquivos

- `package.json`: comandos gerais para instalar, rodar e compilar o projeto completo.
- `.env`: credenciais e configuracoes locais do banco e da aplicacao.
- `.env.example`: modelo das variaveis de ambiente que devem existir localmente.
- `schema.sql`: estrutura das tabelas do MySQL.
- `backend/src/server.ts`: ponto de entrada da API Express.
- `backend/src/config/env.ts`: leitura das configuracoes do `.env`.
- `backend/src/config/database.ts`: conexao com o MySQL.
- `backend/src/routes/`: rotas da API separadas por modulo.
- `backend/src/scripts/initDb.ts`: cria a estrutura inicial do banco.
- `backend/src/scripts/seedDb.ts`: popula o banco com dados ficticios.
- `backend/src/scripts/testDb.ts`: testa a conexao com o banco.
- `frontend/src/App.tsx`: estrutura principal da aplicacao React.
- `frontend/src/pages/`: telas do sistema.
- `frontend/src/services/api.ts`: comunicacao do frontend com a API.
- `instrucoes.md`: passo a passo direto para rodar o projeto no WSL.
- `README_DESENVOLVIMENTO.md`: guia tecnico para manutencao e continuidade do projeto.
- `API.md`: resumo das rotas disponiveis.
- `TESTES.md`: checklist de testes manuais e tecnicos.

## Como rodar rapidamente pelo WSL

Entre na pasta `src` do projeto:

```bash
cd /mnt/c/docsw/EngenhariaII/Sistema-de-Gerenciamento-Comercial-e-Produtivo/src
```

Instale as dependencias:

```bash
npm install
npm run install:all
```

Configure o arquivo `.env` na pasta `src`.

Exemplo:

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

Crie as tabelas:

```bash
npm run init:db --prefix backend
```

Popule o banco com dados ficticios:

```bash
npm run seed:db --prefix backend
```

Para limpar os dados de demonstracao e popular novamente:

```bash
npm run seed:db:reset --prefix backend
```

Inicie o sistema completo:

```bash
npm run dev
```

Acesse:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`

## Comandos uteis

```bash
npm install
npm run install:all
npm run dev
npm run build --prefix backend
npm run build --prefix frontend
npm run init:db --prefix backend
npm run seed:db --prefix backend
npm run seed:db:reset --prefix backend
npm run test:db --prefix backend
```

## Status da entrega

O sistema ja possui a base completa em TypeScript com React, Express e MySQL. As funcionalidades implementadas cobrem autenticacao, dashboard, clientes, fornecedores, unidades, funcionarios, estoque, faturamento e manutencao. Tambem foram criados scripts de banco, seed com dados ficticios, documentacao de API, checklist de testes e instrucoes de execucao.

As proximas melhorias naturais seriam adicionar validacoes mais avancadas, filtros, relatorios, controle de permissoes por perfil, testes automatizados e refinamentos visuais.