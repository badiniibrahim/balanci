-- CreateTable
CREATE TABLE "Pleasure" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "budgetAmount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "clerkId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Pleasure_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Pleasure" ADD CONSTRAINT "Pleasure_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
