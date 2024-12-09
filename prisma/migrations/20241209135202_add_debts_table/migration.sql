/*
  Warnings:

  - You are about to drop the column `dueDate` on the `Savings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Savings" DROP COLUMN "dueDate";

-- CreateTable
CREATE TABLE "Debts" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "budgetAmount" DOUBLE PRECISION NOT NULL,
    "duAmount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "clerkId" TEXT NOT NULL,
    "remainsToBePaid" DOUBLE PRECISION NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Debts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Debts" ADD CONSTRAINT "Debts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
