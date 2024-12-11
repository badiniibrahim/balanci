"use server";

import prisma from "@/prisma/prisma";
import { SavingsType, SavingsSchema } from "@/schema/savings";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function CreateSavings(form: SavingsType) {
  const { success, data } = SavingsSchema.safeParse(form);
  if (!success) {
    throw new Error("Invalid form data");
  }

  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
    return;
  }

  try {
    const existingUser = await prisma.user.findUniqueOrThrow({
      where: { clerkId: userId },
    });

    await prisma.savings.create({
      data: {
        clerkId: userId,
        userId: existingUser.id,
        ...data,
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

      const savingsPercentage =
        totalBudget > 0 ? (total / totalBudget) * 100 : 0;

      console.log({ totalBudget, totalSaving, totalInvest, savingsPercentage });

      const updatedBudgetRule = await prisma.budgetRule.upsert({
        where: { id: budgetRules.id },
        update: {
          actualSavingsPercentage: savingsPercentage,
        },
        create: {
          needsPercentage: 50,
          savingsPercentage: 30,
          wantsPercentage: 20,
          actualNeedsPercentage: 0,
          actualSavingsPercentage: savingsPercentage,
          actualWantsPercentage: 0,
          userId: existingUser.id,
          clerkId: userId,
        },
      });

      return updatedBudgetRule;
    }

    throw new Error("Failed to process budget or budget rules.");
  } catch (error) {
    console.error("Error in CreateSavings:", error);
    throw new Error("An error occurred while creating savings.");
  }
}
