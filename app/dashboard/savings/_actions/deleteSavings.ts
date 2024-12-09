"use server";

import prisma from "@/prisma/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function DeleteSavings(id: number) {
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
    const savingExists = await prisma.savings.findUnique({
      where: { id },
    });

    if (!savingExists) {
      throw new Error("Saving record not found.");
    }

    await prisma.savings.delete({
      where: { id },
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
        orderBy: { type: "asc" },
      }),
    ]);

    const totalBudget = budget?._sum?.amount || 0;

    const totalSaving =
      totalSavings.find((t) => t.type === "saving")?._sum?.budgetAmount || 0;
    const totalInvest =
      totalSavings.find((t) => t.type === "invest")?._sum?.budgetAmount || 0;

    const total = totalSaving + totalInvest;

    const savingPercentage = totalBudget > 0 ? (total / totalBudget) * 100 : 0;

    await prisma.budgetRule.upsert({
      where: { id: budgetRules?.id || 0 },
      update: {
        actualSavingsPercentage: savingPercentage,
      },
      create: {
        needsPercentage: 50,
        savingsPercentage: 30,
        wantsPercentage: 20,
        actualNeedsPercentage: 0,
        actualSavingsPercentage: savingPercentage,
        actualWantsPercentage: 0,
        userId: existingUser.id,
        clerkId: userId,
      },
    });
  } catch (error) {
    console.error("Error while deleting saving:", error);
    throw new Error("An error occurred while processing the saving deletion.");
  }
}
