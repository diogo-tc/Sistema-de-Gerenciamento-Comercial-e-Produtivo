# Roteiro de testes manuais

## Autenticacao

- Acessar `http://localhost:5173`.
- Tentar entrar com credenciais invalidas.
- Entrar com `admin` e `admin123`.
- Verificar se o dashboard aparece.
- Clicar em sair e confirmar retorno para login.

## Banco de dados

```bash
npm run init:db --prefix backend
npm run test:db --prefix backend
```

Resultado esperado:

```text
Banco de dados inicializado com sucesso.
Conexao com MySQL realizada com sucesso.
```

## Clientes e fornecedores

- Cadastrar cliente.
- Editar cliente.
- Excluir cliente.
- Tentar cadastrar CPF duplicado.
- Cadastrar fornecedor.
- Editar fornecedor.
- Excluir fornecedor.

## Unidades e funcionarios

- Cadastrar unidade.
- Cadastrar funcionario vinculado a unidade.
- Editar funcionario.
- Excluir funcionario.
- Tentar cadastrar CPF duplicado.
- Confirmar que nao e possivel cadastrar funcionario sem unidade valida.

## Estoque

- Cadastrar item de estoque.
- Registrar entrada.
- Registrar saida.
- Tentar registrar saida maior que a quantidade disponivel.
- Confirmar bloqueio de estoque negativo.

## Faturamento

- Registrar faturamento.
- Editar faturamento.
- Excluir faturamento.
- Confirmar atualizacao do total exibido.

## Manutencao

- Cadastrar equipamento.
- Registrar manutencao vinculada ao equipamento.
- Editar manutencao.
- Excluir manutencao.
- Excluir equipamento e confirmar remocao das manutencoes vinculadas.

## Build

```bash
npm run build --prefix backend
npm run build --prefix frontend
```

Resultado esperado:

```text
Sem erros de TypeScript.
```
