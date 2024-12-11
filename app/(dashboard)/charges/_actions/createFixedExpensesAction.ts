"use server";

import prisma from "@/prisma/prisma";
import { FixedExpensesSchema, FixedExpensesType } from "@/schema/fixedExpenses";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function CreateFixedExpenses(form: FixedExpensesType) {
  const { success, data } = FixedExpensesSchema.safeParse(form);
  if (!success) {
    throw new Error("Invalid form data");
  }

  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  try {
    const existingUser = await prisma.user.findUniqueOrThrow({
      where: { clerkId: userId },
    });

    await prisma.fixedExpense.create({
      data: {
        clerkId: userId,
        userId: existingUser.id,
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate) : new Date(),
      },
    });

    const [budget, budgetRules, totalFixedExpenses, totalSavings] =
      await prisma.$transaction([
        prisma.budget.findFirst({
          where: { clerkId: userId, userId: existingUser.id },
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
      ]);

    if (budget && budgetRules && totalFixedExpenses) {
      const totalBudget = budget.amount;

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

      const updatedBudgetRule = await prisma.budgetRule.upsert({
        where: { id: budgetRules.id },
        update: {
          actualNeedsPercentage: needsPercentage,
          actualSavingsPercentage: savingsPercentage,
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
    }

    throw new Error("Failed to process budget or budget rules.");
  } catch (error) {
    console.error("Error in CreateFixedExpenses:", error);
    throw new Error("An error occurred while creating fixed expenses.");
  }
}
