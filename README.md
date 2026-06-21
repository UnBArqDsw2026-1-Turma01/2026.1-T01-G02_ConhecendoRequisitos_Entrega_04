# RepositorioTemplate

Repositório que deve ser utilizado como template inicial pelos grupos da matéria de Arquitetura e Desenho de Software.

## Introdução

Este repositório traz um template de repo de documentação a ser seguido pelos grupos de arquitetura e desenho de software.

## Tecnologia

A geração do site estático é realizada utilizando o [docsify](https://docsify.js.org/).

```shell
"Docsify generates your documentation website on the fly. Unlike GitBook, it does not generate static html files. Instead, it smartly loads and parses your Markdown files and displays them as a website. To start using it, all you need to do is create an index.html and deploy it on GitHub Pages."
```

### Instalando o docsify

Execute o comando:

```shell
npm i docsify-cli -g
```

### Executando localmente

Para iniciar o site de documentação localmente, utilize o comando:

```shell
docsify serve ./docs
```

---

## Como Executar o Projeto (Aplicação)

O projeto é dividido em um monorepo contendo as aplicações `frontend` e `backend` dentro do diretório `apps/`.

### 1. Backend (NestJS & Prisma)
Para iniciar a API do backend:
1. Acesse o diretório:
   ```bash
   cd apps/backend
   ```
2. Crie e configure o arquivo `.env` com as credenciais do banco Supabase (conforme exemplo em `.env.example`).
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Aplique as migrations e gere o cliente Prisma:
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```
5. Alimente o banco de dados com a seed:
   ```bash
   npx prisma db seed
   ```
6. Inicie o servidor:
   ```bash
   npm run start:dev
   ```

### 2. Frontend (React & Vite)
Para iniciar a interface do usuário do frontend:
1. Acesse o diretório:
   ```bash
   cd apps/frontend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor Vite:
   ```bash
   npm run dev
   ```

