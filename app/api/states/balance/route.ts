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
        prisma.fixedExpense.groupBy({
          by: ["type"],
          where: { clerkId: user.id, userId: existingUser.id },
          _sum: { budgetAmount: true },
          orderBy: {
            type: "asc",
          },
        }),
        prisma.budgetRule.findFirst({
          where: {
            userId: existingUser.id,
          },
        }),
      ]);

    const currency = userSettings?.currency || "USD";

    const totalFixed =
      totalExpense.find((t) => t.type === "fixed")?._sum?.budgetAmount || 0;
    const totalVariable =
      totalExpense.find((t) => t.type === "variable")?._sum?.budgetAmount || 0;

    const remainsBudget =
      (totalBudget._sum.amount || 0) - totalFixed - totalVariable;

    return Response.json({
      income: totalBudget._sum.amount || 0,
      expense: totalFixed || 0,
      variable: totalVariable,
      remainsBudget: remainsBudget,
      currency,
      budgetRules: budgetRules,
    });
  }

  return Response.json({ error: "User not found" }, { status: 404 });
}
