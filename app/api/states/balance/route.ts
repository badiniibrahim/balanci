import prisma from "@/prisma/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function GET() {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const existingUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
  });

  if (existingUser) {
    const [userSettings, totalBudget, totalExpense, budgetRules] =
      await Promise.all([
        prisma.userSettings.findUnique({
          where: { id: existingUser.id },
        }),
        prisma.budget.aggregate({
          where: {
            userId: existingUser.id,
          },
          _sum: {
            amount: true,
          },
        }),
        prisma.fixedExpense.aggregate({
          where: {
            userId: existingUser.id,
          },
          _sum: {
            budgetAmount: true,
          },
        }),
        prisma.budgetRule.findFirst({
          where: {
            userId: existingUser.id,
          },
        }),
      ]);

    const currency = userSettings?.currency || "USD";

    return Response.json({
      income: totalBudget._sum.amount || 0,
      expense: totalExpense._sum.budgetAmount || 0,
      currency,
      budgetRules: budgetRules,
    });
  }

  return Response.json({ error: "User not found" }, { status: 404 });
}
