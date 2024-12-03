/*
  Warnings:

  - A unique constraint covering the columns `[clerkId]` on the table `UserSettings` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserSettings_clerkId_key" ON "UserSettings"("clerkId");
