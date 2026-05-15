# Requisitos do Sistema

## Visão Geral

O sistema será uma aplicação web utilizada exclusivamente pelo gerente da empresa, permitindo o gerenciamento administrativo das operações da empresa de produção de alimentos.

O objetivo principal é centralizar informações importantes da empresa, reduzindo falhas manuais e melhorando o controle administrativo.

---

# Requisitos Funcionais

## RF01 — Autenticação
O sistema deve permitir que o gerente realize login utilizando usuário e senha.

---

## RF02 — Gerenciamento de Clientes
O sistema deve permitir:

- Cadastrar clientes;
- Editar clientes;
- Excluir clientes;
- Consultar clientes.

---

## RF03 — Gerenciamento de Fornecedores
O sistema deve permitir:

- Cadastrar fornecedores;
- Editar fornecedores;
- Excluir fornecedores;
- Consultar fornecedores.

---

## RF04 — Controle de Estoque
O sistema deve permitir:

- Cadastro de produtos e insumos;
- Registro de entrada de estoque;
- Registro de saída de estoque;
- Controle da quantidade disponível.

---

## RF05 — Gerenciamento de Funcionários
O sistema deve permitir:

- Cadastro de funcionários;
- Associação de funcionários a unidades;
- Registro de cargos;
- Registro de salários.

---

## RF06 — Gerenciamento de Unidades
O sistema deve permitir:

- Cadastro de unidades;
- Associação de funcionários às unidades.

---

## RF07 — Controle de Faturamento
O sistema deve permitir o registro básico de informações financeiras relacionadas às vendas realizadas.

---

## RF08 — Manutenção de Máquinas
O sistema poderá permitir:

- Cadastro de equipamentos;
- Registro de manutenções realizadas.

---

# Requisitos Não Funcionais

## RNF01 — Interface Web
O sistema deverá ser acessível através de navegador web.

---

## RNF02 — Segurança de Acesso
O acesso ao sistema deverá exigir autenticação por login e senha.

---

## RNF03 — Persistência de Dados
As informações do sistema deverão ser armazenadas em banco de dados MySQL.

---

## RNF04 — Controle de Versão
O desenvolvimento do projeto deverá utilizar GitHub para versionamento.

---

## RNF05 — Usabilidade
O sistema deverá possuir interface simples, organizada e de fácil utilização.

---

# Regras de Negócio

## RN01 — CPF Único
O CPF de cada cliente e funcionário não poderá ser repetido no sistema.

---

## RN02 — Estoque Não Negativo
O sistema não deverá permitir saídas de estoque que resultem em quantidade negativa.

---

## RN03 — Acesso Restrito
Somente usuários autenticados poderão acessar o sistema.

---

## RN04 — Funcionário Vinculado
Todo funcionário deverá estar vinculado a uma unidade da empresa.

---

# Histórias de Usuário

## HU01 — Login no Sistema

### História
Como gerente, quero realizar login no sistema para acessar as funcionalidades administrativas.

### Critérios de Aceitação
- O sistema deve solicitar login e senha;
- O acesso só deve ocorrer com credenciais válidas;
- Usuários não autenticados não podem acessar o sistema.

---

## HU02 — Cadastro de Clientes

### História
Como gerente, quero cadastrar clientes para manter controle das informações comerciais.

### Critérios de Aceitação
- Deve ser possível cadastrar nome, CPF e telefone;
- O CPF não pode ser duplicado;
- O cliente deve ficar armazenado no banco de dados.

---

## HU03 — Gerenciamento de Fornecedores

### História
Como gerente, quero cadastrar fornecedores para organizar os parceiros comerciais da empresa.

### Critérios de Aceitação
- Deve ser possível cadastrar fornecedores;
- O sistema deve permitir edição e exclusão;
- As informações devem ser persistidas no banco de dados.

---

## HU04 — Controle de Estoque

### História
Como gerente, quero registrar entradas e saídas de produtos para controlar o estoque da empresa.

### Critérios de Aceitação
- O sistema deve registrar entradas de produtos;
- O sistema deve registrar saídas de produtos;
- O estoque não pode ficar negativo.

---

## HU05 — Cadastro de Funcionários

### História
Como gerente, quero cadastrar funcionários para organizar a administração interna da empresa.

### Critérios de Aceitação
- Deve ser possível cadastrar cargo e salário;
- O funcionário deve estar vinculado a uma unidade;
- O CPF não pode ser repetido.

---

## HU06 — Cadastro de Unidades

### História
Como gerente, quero cadastrar unidades da empresa para organizar os setores e funcionários.

### Critérios de Aceitação
- Deve ser possível cadastrar unidades;
- Funcionários devem poder ser vinculados às unidades.

---

## HU07 — Registro de Faturamento

### História
Como gerente, quero registrar faturamentos para acompanhar as vendas realizadas.

### Critérios de Aceitação
- Deve ser possível registrar informações financeiras básicas;
- Os dados devem ser armazenados no banco de dados.

---

## HU08 — Manutenção de Máquinas

### História
Como gerente, quero registrar manutenções de equipamentos para acompanhar o estado das máquinas.

### Critérios de Aceitação
- Deve ser possível cadastrar equipamentos;
- Deve ser possível registrar manutenções realizadas.

---

# Casos de Uso

## Principais Casos de Uso

- Realizar login;
- Gerenciar clientes;
- Gerenciar fornecedores;
- Controlar estoque;
- Gerenciar funcionários;
- Gerenciar unidades;
- Registrar faturamento;
- Registrar manutenção de máquinas.

---

# Diagrama de Casos de Uso

![Imagem do Sistema](https://drive.google.com/uc?export=view&id=1krGz9636OcuDunak877-s7pfAec8dFQ1)

## Ator Principal
- Gerente

## Casos de Uso
- Login
- Gerenciar Clientes
- Gerenciar Fornecedores
- Controlar Estoque
- Gerenciar Funcionários
- Gerenciar Unidades
- Registrar Faturamento
- Registrar Manutenção

---