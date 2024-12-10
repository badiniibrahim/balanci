"use server";

import prisma from "@/prisma/prisma";
import { IncomeSchema, IncomeSchemaType } from "@/schema/income";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function CreateIncome(from: IncomeSchemaType) {
  const { success, data } = IncomeSchema.safeParse(from);
  if (!success) {
    throw new Error("Invalid form data.");
  }

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
    const result = await prisma.budget.create({
      data: {
        clerkId: userId,
        userId: existingUser.id,
        ...data,
      },
    });

    if (!result) {
      throw new Error("Failed to create income.");
    }

    const [
      budget,
      budgetRules,
      totalFixedExpenses,
      totalSavings,
      totalPleasures,
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
    ]);

    if (budget && budgetRules && totalFixedExpenses && totalSavings) {
      const totalBudget = budget._sum.amount || 0;
      const totalPleasure = totalPleasures._sum.budgetAmount || 0;

      const totalFixed =
        totalFixedExpenses.find((t) => t.type === "fixed")?._sum
          ?.budgetAmount || 0;
      const totalVariable =
        totalFixedExpenses.find((t) => t.type === "variable")?._sum
          ?.budgetAmount || 0;

      const totalSaving =
        totalSavings.find((t) => t.type === "saving")?._sum?.budgetAmount || 0;
      const totalInvest =
        totalSavings.find((t) => t.type === "invest")?._sum?.budgetAmount || 0;

      const total = totalFixed + totalVariable;

      const needsPercentage = (total / totalBudget) * 100;

      const savingsPercentage =
        ((totalSaving + totalInvest) / totalBudget) * 100;

      const actualWantsPercentage = (totalPleasure / totalBudget) * 100;

      const updatedBudgetRule = await prisma.budgetRule.upsert({
        where: { id: budgetRules.id },
        update: {
          actualNeedsPercentage: needsPercentage,
          actualSavingsPercentage: savingsPercentage,
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

      return updatedBudgetRule;
    } else {
      throw new Error("Budget calculations failed.");
    }
  } catch (error) {
    console.error("Error creating income:", error);
    throw new Error("An error occurred while processing your request.");
  }
}
