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
    prisma.fixedExpense.groupBy({
      by: ["type"],
      where: { clerkId: userId, userId: existingUser.id },
      _sum: { budgetAmount: true },
      orderBy: {
        type: "asc",
      },
    }),
  ]);

  if (budget && budgetRules && totalFixedExpenses) {
    const totalBudget = budget._sum.amount || 0;
    const totalFixed =
      totalFixedExpenses.find((t) => t.type === "fixed")?._sum?.budgetAmount ||
      0;
    const totalVariable =
      totalFixedExpenses.find((t) => t.type === "variable")?._sum
        ?.budgetAmount || 0;

    const total = totalFixed + totalVariable;
    const needsPercentage = (total / totalBudget) * 100;
    await prisma.budgetRule.upsert({
      where: { id: budgetRules.id },
      update: {
        actualNeedsPercentage: needsPercentage,
        actualSavingsPercentage: 0,
        actualWantsPercentage: 0,
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

  throw new Error("Budget calculations failed.");
}
