/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/prisma/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function GET() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
    return;
  }

  const existingUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
  });

  if (!existingUser) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  const userId = existingUser.id;

  // Fetch all required data in parallel
  const [userSettings, totalBudget, expenseData, budgetRules, savingsData, totalDebts] =
    await Promise.all([
      prisma.userSettings.findUnique({ where: { id: userId } }),
      prisma.budget.aggregate({
        where: { userId },
        _sum: { amount: true },
      }),
      prisma.fixedExpense.groupBy({
        by: ["type"],
        where: { userId },
        _sum: { budgetAmount: true },
        orderBy: { type: "asc" },
      }),
      prisma.budgetRule.findFirst({ where: { userId } }),
      prisma.savings.groupBy({
        by: ["type"],
        where: { userId },
        _sum: { budgetAmount: true },
        orderBy: { type: "asc" },
      }),
      prisma.debts.aggregate({
        where: { userId },
        _sum: { budgetAmount: true },
      }),
    ]);

  const currency = userSettings?.currency || "USD";

  // Helper function to get sum by type
  const getSumByType = (data: any, type: any) =>
    data.find((item: any) => item.type === type)?._sum?.budgetAmount || 0;

  const totalFixed = getSumByType(expenseData, "fixed");
  const totalVariable = getSumByType(expenseData, "variable");
  const totalSaving = getSumByType(savingsData, "saving");
  const totalInvest = getSumByType(savingsData, "invest");

  const income = totalBudget._sum.amount || 0;
  const totalDebt = totalDebts._sum.budgetAmount || 0
  const remainsBudget =
    income - totalFixed - totalVariable - totalSaving - totalInvest - totalDebt;

  return Response.json({
    income,
    expense: totalFixed,
    variable: totalVariable,
    remainsBudget,
    currency,
    budgetRules,
    savings: totalSaving + totalInvest,
    debts:totalDebt
  });
}
