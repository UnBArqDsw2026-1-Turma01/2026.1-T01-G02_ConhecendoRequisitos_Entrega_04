-- AlterTable
ALTER TABLE "usuario" ADD COLUMN "email_verificado" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "token_recuperacao" TEXT,
ADD COLUMN "data_expiracao_token" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_token_recuperacao_key" ON "usuario"("token_recuperacao");
