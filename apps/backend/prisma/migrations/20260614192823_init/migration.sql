-- CreateEnum
CREATE TYPE "TipoUsuario" AS ENUM ('aluno', 'administrador');

-- CreateTable
CREATE TABLE "usuario" (
    "email" VARCHAR(255) NOT NULL,
    "nome" VARCHAR(150) NOT NULL,
    "senha" VARCHAR(255) NOT NULL,
    "tipo" "TipoUsuario" NOT NULL,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("email")
);

-- CreateTable
CREATE TABLE "administrador" (
    "email" VARCHAR(255) NOT NULL,
    "qtdConteudosCriados" INTEGER NOT NULL DEFAULT 0,
    "qtdQuizzesCriados" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "administrador_pkey" PRIMARY KEY ("email")
);

-- CreateTable
CREATE TABLE "aluno" (
    "email" VARCHAR(255) NOT NULL,
    "maiorOfensiva" INTEGER NOT NULL DEFAULT 0,
    "ofensivaAtual" INTEGER NOT NULL DEFAULT 0,
    "ultimoAcesso" DATE,

    CONSTRAINT "aluno_pkey" PRIMARY KEY ("email")
);

-- CreateTable
CREATE TABLE "trilha" (
    "id" SERIAL NOT NULL,
    "titulo" VARCHAR(200) NOT NULL,
    "descricao" TEXT,
    "ordem" INTEGER,

    CONSTRAINT "trilha_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "modulo" (
    "id" SERIAL NOT NULL,
    "titulo" VARCHAR(200) NOT NULL,
    "descricao" TEXT,
    "ordem" INTEGER,
    "id_trilha" INTEGER NOT NULL,

    CONSTRAINT "modulo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conteudo" (
    "id" SERIAL NOT NULL,
    "titulo" VARCHAR(200) NOT NULL,
    "corpo" TEXT,
    "ordem" INTEGER,
    "id_modulo" INTEGER NOT NULL,

    CONSTRAINT "conteudo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz" (
    "id" SERIAL NOT NULL,
    "titulo" VARCHAR(200) NOT NULL,
    "id_modulo" INTEGER,

    CONSTRAINT "quiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questao" (
    "id" SERIAL NOT NULL,
    "enunciado" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "ordem" INTEGER,
    "id_quiz" INTEGER NOT NULL,

    CONSTRAINT "questao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alternativa" (
    "id" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL,
    "alternativaCorreta" BOOLEAN NOT NULL DEFAULT false,
    "ordem" INTEGER,
    "id_questao" INTEGER NOT NULL,

    CONSTRAINT "alternativa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "progresso_trilha" (
    "id" SERIAL NOT NULL,
    "progresso" INTEGER NOT NULL DEFAULT 0,
    "dataDeFinalizacao" DATE,
    "email_aluno" VARCHAR(255) NOT NULL,
    "id_trilha" INTEGER NOT NULL,

    CONSTRAINT "progresso_trilha_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "progresso_modulo" (
    "id" SERIAL NOT NULL,
    "progresso" INTEGER NOT NULL DEFAULT 0,
    "dataDeFinalizacao" DATE,
    "id_progresso_trilha" INTEGER NOT NULL,
    "id_modulo" INTEGER NOT NULL,

    CONSTRAINT "progresso_modulo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "progresso_conteudo" (
    "id" SERIAL NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "dataDeFinalizacao" DATE,
    "id_progresso_modulo" INTEGER NOT NULL,
    "id_conteudo" INTEGER NOT NULL,

    CONSTRAINT "progresso_conteudo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tentativa_quiz" (
    "id" SERIAL NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "progresso" INTEGER NOT NULL DEFAULT 0,
    "dataDeFinalizacao" DATE,
    "email_aluno" VARCHAR(255) NOT NULL,
    "id_quiz" INTEGER NOT NULL,

    CONSTRAINT "tentativa_quiz_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "quiz_id_modulo_key" ON "quiz"("id_modulo");

-- CreateIndex
CREATE UNIQUE INDEX "progresso_trilha_email_aluno_id_trilha_key" ON "progresso_trilha"("email_aluno", "id_trilha");

-- CreateIndex
CREATE UNIQUE INDEX "progresso_modulo_id_progresso_trilha_id_modulo_key" ON "progresso_modulo"("id_progresso_trilha", "id_modulo");

-- CreateIndex
CREATE UNIQUE INDEX "progresso_conteudo_id_progresso_modulo_id_conteudo_key" ON "progresso_conteudo"("id_progresso_modulo", "id_conteudo");

-- AddForeignKey
ALTER TABLE "administrador" ADD CONSTRAINT "administrador_email_fkey" FOREIGN KEY ("email") REFERENCES "usuario"("email") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aluno" ADD CONSTRAINT "aluno_email_fkey" FOREIGN KEY ("email") REFERENCES "usuario"("email") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "modulo" ADD CONSTRAINT "modulo_id_trilha_fkey" FOREIGN KEY ("id_trilha") REFERENCES "trilha"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conteudo" ADD CONSTRAINT "conteudo_id_modulo_fkey" FOREIGN KEY ("id_modulo") REFERENCES "modulo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz" ADD CONSTRAINT "quiz_id_modulo_fkey" FOREIGN KEY ("id_modulo") REFERENCES "modulo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questao" ADD CONSTRAINT "questao_id_quiz_fkey" FOREIGN KEY ("id_quiz") REFERENCES "quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alternativa" ADD CONSTRAINT "alternativa_id_questao_fkey" FOREIGN KEY ("id_questao") REFERENCES "questao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progresso_trilha" ADD CONSTRAINT "progresso_trilha_email_aluno_fkey" FOREIGN KEY ("email_aluno") REFERENCES "aluno"("email") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progresso_trilha" ADD CONSTRAINT "progresso_trilha_id_trilha_fkey" FOREIGN KEY ("id_trilha") REFERENCES "trilha"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progresso_modulo" ADD CONSTRAINT "progresso_modulo_id_progresso_trilha_fkey" FOREIGN KEY ("id_progresso_trilha") REFERENCES "progresso_trilha"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progresso_modulo" ADD CONSTRAINT "progresso_modulo_id_modulo_fkey" FOREIGN KEY ("id_modulo") REFERENCES "modulo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progresso_conteudo" ADD CONSTRAINT "progresso_conteudo_id_progresso_modulo_fkey" FOREIGN KEY ("id_progresso_modulo") REFERENCES "progresso_modulo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progresso_conteudo" ADD CONSTRAINT "progresso_conteudo_id_conteudo_fkey" FOREIGN KEY ("id_conteudo") REFERENCES "conteudo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tentativa_quiz" ADD CONSTRAINT "tentativa_quiz_email_aluno_fkey" FOREIGN KEY ("email_aluno") REFERENCES "aluno"("email") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tentativa_quiz" ADD CONSTRAINT "tentativa_quiz_id_quiz_fkey" FOREIGN KEY ("id_quiz") REFERENCES "quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;
