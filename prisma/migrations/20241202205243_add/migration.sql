/*
  Warnings:

  - A unique constraint covering the columns `[clerkId]` on the table `Budget` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[clerkId]` on the table `BudgetRule` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[clerkId]` on the table `FixedExpense` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[clerkId]` on the table `VariableExpense` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Budget_clerkId_key" ON "Budget"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "BudgetRule_clerkId_key" ON "BudgetRule"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "FixedExpense_clerkId_key" ON "FixedExpense"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "VariableExpense_clerkId_key" ON "VariableExpense"("clerkId");
