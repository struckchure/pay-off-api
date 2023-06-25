/*
  Warnings:

  - A unique constraint covering the columns `[userId,biometricType]` on the table `biometrics` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "biometrics_userId_biometricType_key" ON "biometrics"("userId", "biometricType");
