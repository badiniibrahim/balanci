"use server";

import prisma from "@/prisma/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function DeletePleasure(id: number) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
    return;
  }

  const existingUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!existingUser) {
    throw new Error("User not found.");
  }

  try {
    await prisma.pleasure.delete({
      where: { id },
    });

    const [budget, budgetRules, totalPleasure] = await prisma.$transaction([
      prisma.budget.aggregate({
        where: { clerkId: userId, userId: existingUser.id },
        _sum: { amount: true },
      }),
      prisma.budgetRule.findFirst({
        where: { clerkId: userId, userId: existingUser.id },
      }),

      prisma.pleasure.aggregate({
        where: { clerkId: userId, userId: existingUser.id },
        _sum: { budgetAmount: true },
      }),
    ]);

    if (budget && budgetRules && totalPleasure) {
      const totalBudget = budget._sum.amount || 0;
      const total = totalPleasure._sum.budgetAmount || 0;
      const pleasurePercentage =
        totalBudget > 0 ? (total / totalBudget) * 100 : 0;

      await prisma.budgetRule.upsert({
        where: { id: budgetRules.id },
        update: {
          actualWantsPercentage: pleasurePercentage,
        },
        create: {
          needsPercentage: 50,
          savingsPercentage: 30,
          wantsPercentage: 20,
          actualNeedsPercentage: 0,
          actualSavingsPercentage: 0,
          actualWantsPercentage: pleasurePercentage,
          userId: existingUser.id,
          clerkId: userId,
        },
      });

     // return updatedBudgetRule;
    }
  } catch (error) {
    console.error("Error while deleting saving:", error);
    throw new Error("An error occurred while processing the saving deletion.");
  }
}
