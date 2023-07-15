/*
  Warnings:

  - The values [SUCCESSFULL] on the enum `TransactionStatus` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[reference]` on the table `transactions` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TransactionStatus_new" AS ENUM ('PENDING', 'FAILED', 'SUCCESSFUL');
ALTER TABLE "transactions" ALTER COLUMN "transactionStatus" TYPE "TransactionStatus_new" USING ("transactionStatus"::text::"TransactionStatus_new");
ALTER TYPE "TransactionStatus" RENAME TO "TransactionStatus_old";
ALTER TYPE "TransactionStatus_new" RENAME TO "TransactionStatus";
DROP TYPE "TransactionStatus_old";
COMMIT;

-- CreateIndex
CREATE UNIQUE INDEX "transactions_reference_key" ON "transactions"("reference");
