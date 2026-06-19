-- CreateEnum
CREATE TYPE "StatusProgresso" AS ENUM ('nao_iniciado', 'em_andamento', 'concluido');

-- AlterTable
ALTER TABLE "progresso_trilha"
ADD COLUMN "status" "StatusProgresso" NOT NULL DEFAULT 'nao_iniciado',
ADD COLUMN "dataInicio" TIMESTAMP(3),
ADD COLUMN "dataUltimaAtualizacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "progresso_modulo"
ADD COLUMN "status" "StatusProgresso" NOT NULL DEFAULT 'nao_iniciado',
ADD COLUMN "dataInicio" TIMESTAMP(3),
ADD COLUMN "dataUltimaAtualizacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "tentativa_quiz"
ALTER COLUMN "status" DROP DEFAULT,
ALTER COLUMN "status" TYPE "StatusProgresso" USING (
  CASE
    WHEN "status" = true THEN 'concluido'::"StatusProgresso"
    ELSE 'nao_iniciado'::"StatusProgresso"
  END
),
ADD COLUMN "dataInicio" TIMESTAMP(3),
ADD COLUMN "dataUltimaAtualizacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "tentativa_quiz_email_aluno_id_quiz_key" ON "tentativa_quiz"("email_aluno", "id_quiz");
