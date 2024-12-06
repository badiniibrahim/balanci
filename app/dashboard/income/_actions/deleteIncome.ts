"use server";

import prisma from "@/prisma/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function DeleteIncome(id: number) {
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

  const deletedBudget = await prisma.budget.delete({
    where: {
      id,
      clerkId: userId,
      userId: existingUser.id,
    },
  });

  if (!deletedBudget) {
    throw new Error("Failed to delete the budget entry.");
  }

  const [budget, budgetRules, totalFixedExpenses] = await prisma.$transaction([
    prisma.budget.aggregate({
      where: { clerkId: userId, userId: existingUser.id },
      _sum: { amount: true },
    }),
    prisma.budgetRule.findFirst({
      where: { clerkId: userId, userId: existingUser.id },
    }),
    prisma.fixedExpense.aggregate({
      where: { clerkId: userId, userId: existingUser.id },
      _sum: { budgetAmount: true },
    }),
  ]);

  const totalBudget = budget._sum.amount || 0;
  const totalFixed = totalFixedExpenses._sum.budgetAmount || 0;

  if (totalBudget > 0) {
    const needsPercentage = (totalFixed / totalBudget) * 100;

    const updatedBudgetRule = await prisma.budgetRule.upsert({
      where: { id: budgetRules?.id || 0 },
      update: {
        actualNeedsPercentage: needsPercentage,
        actualSavingsPercentage: 0,
        actualWantsPercentage: 0,
      },
      create: {
        needsPercentage: 50,
        savingsPercentage: 30,
        wantsPercentage: 20,
        actualNeedsPercentage: needsPercentage,
        actualSavingsPercentage: 0,
        actualWantsPercentage: 0,
        userId: existingUser.id,
        clerkId: userId,
      },
    });

    return updatedBudgetRule;
  }

  throw new Error("Budget calculations failed.");
}
