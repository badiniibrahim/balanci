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

  const existingBudget = await prisma.budget.findUnique({
    where: { id, clerkId: userId, userId: existingUser.id },
  });

  if (!existingBudget) {
    throw new Error("Budget entry not found.");
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

  const [
    budget,
    budgetRules,
    totalFixedExpenses,
    totalSavings,
    totalPleasures,
    totalDets
  ] = await prisma.$transaction([
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
    prisma.savings.groupBy({
      by: ["type"],
      where: { clerkId: userId, userId: existingUser.id },
      _sum: { budgetAmount: true },
      orderBy: {
        type: "asc",
      },
    }),
    prisma.pleasure.aggregate({
      where: { clerkId: userId, userId: existingUser.id },
      _sum: { budgetAmount: true },
    }),
    prisma.debts.aggregate({
      where: { clerkId: userId, userId: existingUser.id },
      _sum: { budgetAmount: true },
    }),
  ]);

  // Si les données nécessaires existent, calculs et mise à jour des règles
  if (budget && budgetRules && totalFixedExpenses && totalSavings && totalPleasures) {
    const totalBudget = budget._sum.amount || 0;
    const totalPleasure = totalPleasures._sum.budgetAmount || 0;
    const totaltotalDet = totalDets._sum.budgetAmount || 0;


    const totalFixed =
      totalFixedExpenses.find((t) => t.type === "fixed")?._sum?.budgetAmount ||
      0;
    const totalVariable =
      totalFixedExpenses.find((t) => t.type === "variable")?._sum
        ?.budgetAmount || 0;

    const totalSaving =
      totalSavings.find((t) => t.type === "saving")?._sum?.budgetAmount || 0;
    const totalInvest =
      totalSavings.find((t) => t.type === "invest")?._sum?.budgetAmount || 0;

    const total = totalFixed + totalVariable;
    const totalSavingInvestDebts = totalSaving + totalInvest + totaltotalDet;


    // Calcul des pourcentages
    const needsPercentage = totalBudget ? (total / totalBudget) * 100 : 0;
    const actualSavingsPercentage =
      totalBudget ? (totalSavingInvestDebts / totalBudget) * 100 : 0;
    const actualWantsPercentage = totalBudget ? (totalPleasure / totalBudget) * 100 : 0;

    // Mise à jour ou création des règles de budget
    await prisma.budgetRule.upsert({
      where: { id: budgetRules.id },
      update: {
        actualNeedsPercentage: needsPercentage,
        actualSavingsPercentage: actualSavingsPercentage,
        actualWantsPercentage: actualWantsPercentage,
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
  } else {
    throw new Error("Budget calculations failed or missing data.");
  }
}
