/*
  Warnings:

  - Added the required column `reference` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'FAILED', 'SUCCESSFULL');

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "reference" TEXT NOT NULL,
ADD COLUMN     "transactionStatus" "TransactionStatus";
