"use server";

import prisma from "@/prisma/prisma";
import { PleasuresSchema, PleasuresType } from "@/schema/pleasures";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function CreatePleasure(form: PleasuresType) {
  const { success, data } = PleasuresSchema.safeParse(form);
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

    await prisma.pleasure.create({
      data: {
        clerkId: userId,
        userId: existingUser.id,
        ...data,
      },
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

      const updatedBudgetRule = await prisma.budgetRule.upsert({
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

      return updatedBudgetRule;
    }
  } catch (error) {
    console.error("Error in CreatePleasure:", error);
    throw new Error("An error occurred while creating pleasure.");
  }
}
