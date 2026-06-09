# Instrucoes para rodar o sistema pelo WSL

Este projeto roda com Node.js, Express, TypeScript, React e MySQL.

## 1. Entrar na pasta do projeto

No terminal do WSL, rode:

```bash
cd /mnt/c/docsw/EngenhariaII/Sistema-de-Gerenciamento-Comercial-e-Produtivo/src
```

## 2. Conferir Node.js e npm

```bash
node --version
npm --version
```

O projeto foi testado com Node.js `v18.19.1` e npm `9.2.0`.

## 3. Instalar as dependencias

Dentro da pasta `src`, rode:

```bash
npm install
npm run install:all
```

Esse comando instala as dependencias da raiz, do backend e do frontend.

## 4. Conferir o arquivo .env

O arquivo `.env` deve ter as configuracoes do projeto e do MySQL. Exemplo:

```env
PORT=3000
NODE_ENV=development
SESSION_SECRET=chave-local-de-desenvolvimento

ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

DB_HOST=localhost
DB_PORT=3306
DB_USER=sistema_paes_user
DB_PASSWORD=sistema123
DB_NAME=sistema_paes

CLIENT_URL=http://localhost:5173
```

Se estiver usando outro usuario ou senha do MySQL, ajuste `DB_USER` e `DB_PASSWORD`.

## 5. Iniciar o MySQL no WSL

```bash
sudo service mysql start
```

Para conferir se esta ativo:

```bash
sudo service mysql status
```

## 6. Criar usuario do MySQL para o projeto

Se o usuario do projeto ainda nao existir, entre no MySQL:

```bash
sudo mysql
```

Depois rode os comandos abaixo dentro do console do MySQL:

```sql
CREATE USER 'sistema_paes_user'@'localhost' IDENTIFIED BY 'sistema123';
GRANT ALL PRIVILEGES ON sistema_paes.* TO 'sistema_paes_user'@'localhost';
GRANT CREATE ON *.* TO 'sistema_paes_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

Se o usuario ja existir, e aparecer erro ao tentar criar, basta conferir se o `.env` esta usando o mesmo usuario e senha.

## 7. Inicializar o banco de dados

```bash
npm run init:db --prefix backend
```

Se tudo estiver correto, deve aparecer:

```text
Banco de dados inicializado com sucesso.
```

## 8. Testar a conexao com o MySQL

```bash
npm run test:db --prefix backend
```

Se tudo estiver correto, deve aparecer:

```text
Conexao com MySQL realizada com sucesso.
```

## 9. Rodar backend e frontend

```bash
npm run dev
```

Esse comando sobe os dois servidores ao mesmo tempo:

```text
Backend:  http://localhost:3000
Frontend: http://localhost:5173
```

## 10. Acessar o sistema

Abra o navegador e acesse:

```text
http://localhost:5173
```

Login inicial:

```text
Usuario: admin
Senha: admin123
```

## Erros comuns

### tsx: not found

Significa que as dependencias do backend nao foram instaladas. Rode:

```bash
npm install --prefix backend
```

### Access denied for user 'root'@'localhost'

Significa que o `.env` esta tentando acessar o MySQL com `root` sem a senha correta. Use um usuario proprio para o projeto, como `sistema_paes_user`, e atualize o `.env`.

### connect ECONNREFUSED 127.0.0.1:3306

Significa que o MySQL nao esta rodando ou nao esta acessivel na porta 3306. Rode:

```bash
sudo service mysql start
```