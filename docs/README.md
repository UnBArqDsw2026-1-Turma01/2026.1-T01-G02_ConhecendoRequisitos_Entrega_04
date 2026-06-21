# ConhecendoRequisitos

**Código da Disciplina**: FGA0208<br>
**Número do Grupo**: 02<br>
**Entrega**: 04<br>

## Alunos
| Matrícula | Aluno |
| --- | --- |
| 231027032 | Arthur Oliveira |
| 231037665 | Daniel Nascimento |
| 231037692 | Isabella Choukaira |
| 231035455 | Leticia Jesus |
| 231038303 | Yan Aguiar |
| 231012316 | Yasmin Nascimento |

## Sobre 
O **ConhecendoRequisitos** é uma plataforma educacional desenvolvida no contexto da disciplina de **Arquitetura e Desenho de Software (FGA0208)** na Universidade de Brasília (UnB). O projeto visa auxiliar no ensino e aprendizado da Engenharia de Requisitos de forma dinâmica e interativa, por meio de trilhas de aprendizado, módulos teóricos e quizzes avaliativos com feedback em tempo real.

## Screenshots da Quarta Entrega

### 1. Tela de Login e Cadastro
*Interface de autenticação consumindo os componentes reutilizáveis.*
*(Sinalizado para inserção posterior da screenshot)*

### 2. Tela de Trilhas (TrailPage)
*Visualização do progresso das trilhas e módulos.*
*(Sinalizado para inserção posterior da screenshot)*

## Há algo a ser executado?

( X ) SIM

( ) NÃO

O guia detalhado de execução pode ser encontrado em [Desenho de Software (Arquitetura & Reutilização)](ArquiteturaReutilizacao/4.ArquiteturaReutilizacao.md). Segue abaixo o resumo dos comandos para execução local:

### 1. Backend (API NestJS & Prisma)
Acesse a pasta do backend, instale as dependências, configure o banco de dados e inicie o servidor:
```bash
cd apps/backend
# 1. Instalar dependências
npm install

# 2. Configurar o arquivo .env com a DATABASE_URL e DIRECT_URL do Supabase

# 3. Rodar as migrations e aplicar ao banco (sem criar novas)
npx prisma migrate deploy

# 4. Gerar o Prisma Client (essencial para a compilação de tipos)
npx prisma generate

# 5. Popular o banco com dados de teste
npx prisma db seed

# 6. Iniciar o servidor em modo watch
npm run start:dev
```

### 2. Frontend (React & Vite)
Em outro terminal, acesse a pasta do frontend, instale as dependências e inicie o servidor de desenvolvimento:
```bash
cd apps/frontend
# 1. Instalar dependências
npm install

# 2. Iniciar o servidor Vite
npm run dev
```

---

## Informações Complementares 
* **Banco de Dados:** PostgreSQL hospedado em nuvem via **Supabase**.
* **Frontend:** Desenvolvido em **React** utilizando **Vite** e **TypeScript**.
* **Backend:** Desenvolvido em **NestJS** utilizando **Prisma ORM** e **TypeScript**.

