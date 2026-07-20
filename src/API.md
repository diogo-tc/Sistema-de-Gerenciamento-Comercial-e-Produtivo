# Endpoints da API

Todas as rotas abaixo, exceto autenticacao e health check, exigem login.

## Autenticacao

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

## Sistema

- `GET /api/health`
- `GET /api/dashboard`
- `GET /api/modules`

## Clientes

- `GET /api/clientes`
- `POST /api/clientes`
- `PUT /api/clientes/:id`
- `DELETE /api/clientes/:id`

## Fornecedores

- `GET /api/fornecedores`
- `POST /api/fornecedores`
- `PUT /api/fornecedores/:id`
- `DELETE /api/fornecedores/:id`

## Unidades

- `GET /api/unidades`
- `POST /api/unidades`
- `PUT /api/unidades/:id`
- `DELETE /api/unidades/:id`

## Funcionarios

- `GET /api/funcionarios`
- `POST /api/funcionarios`
- `PUT /api/funcionarios/:id`
- `DELETE /api/funcionarios/:id`

## Estoque

- `GET /api/estoque`
- `POST /api/estoque`
- `PUT /api/estoque/:id`
- `DELETE /api/estoque/:id`
- `GET /api/estoque/movimentacoes`
- `POST /api/estoque/movimentacoes`

## Faturamento

- `GET /api/faturamento`
- `POST /api/faturamento`
- `PUT /api/faturamento/:id`
- `DELETE /api/faturamento/:id`

## Manutencao

- `GET /api/manutencao/equipamentos`
- `POST /api/manutencao/equipamentos`
- `PUT /api/manutencao/equipamentos/:id`
- `DELETE /api/manutencao/equipamentos/:id`
- `GET /api/manutencao/manutencoes`
- `POST /api/manutencao/manutencoes`
- `PUT /api/manutencao/manutencoes/:id`
- `DELETE /api/manutencao/manutencoes/:id`
