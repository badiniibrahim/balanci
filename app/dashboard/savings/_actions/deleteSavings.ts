"use server";

import prisma from "@/prisma/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function DeleteSavings(id: number) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const existingUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!existingUser) {
    throw new Error("User not found.");
  }

  try {
    await prisma.savings.delete({
      where: {
        id,
        userId: existingUser.id,
        clerkId: userId,
      },
    });

    const [budget, budgetRules, totalSavings] = await prisma.$transaction([
      prisma.budget.aggregate({
        where: { clerkId: userId, userId: existingUser.id },
        _sum: { amount: true },
      }),
      prisma.budgetRule.findFirst({
        where: { clerkId: userId, userId: existingUser.id },
      }),
      prisma.savings.groupBy({
        by: ["type"],
        where: { clerkId: userId, userId: existingUser.id },
        _sum: { budgetAmount: true },
        orderBy: {
          type: "asc",
        },
      }),
    ]);

    if (budget && budgetRules && totalSavings) {
      const totalBudget = budget._sum.amount || 0;
      const totalSaving =
        totalSavings.find((t) => t.type === "saving")?._sum?.budgetAmount || 0;
      const totalInvest =
        totalSavings.find((t) => t.type === "invest")?._sum?.budgetAmount || 0;

      const total = totalSaving + totalInvest;
      const savingPercentage = (total / totalBudget) * 100;
      await prisma.budgetRule.upsert({
        where: { id: budgetRules.id },
        update: {
          actualSavingsPercentage: savingPercentage,
        },
        create: {
          needsPercentage: 50,
          savingsPercentage: 30,
          wantsPercentage: 20,
          actualNeedsPercentage: 0,
          actualSavingsPercentage: 0,
          actualWantsPercentage: 0,
          userId: existingUser.id,
          clerkId: userId,
        },
      });
    }
  } catch (error) {
    console.error("Error deleting fixed expense:", error);
    throw new Error("An error occurred while deleting the fixed expense.");
  }
}
