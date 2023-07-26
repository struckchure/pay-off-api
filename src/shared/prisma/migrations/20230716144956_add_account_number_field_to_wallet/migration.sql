/*
  Warnings:

  - A unique constraint covering the columns `[email,bvn]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "wallets" ADD COLUMN     "accountNumber" VARCHAR(10);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_bvn_key" ON "users"("email", "bvn");
