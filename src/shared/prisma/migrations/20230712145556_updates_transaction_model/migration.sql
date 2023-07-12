/*
  Warnings:

  - You are about to drop the column `fromUserId` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `toUserId` on the `transactions` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_fromUserId_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_toUserId_fkey";

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "fromUserId",
DROP COLUMN "toUserId",
ADD COLUMN     "meta" JSONB,
ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
