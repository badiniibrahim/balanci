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
    const userSettings = await prisma.userSettings.findUnique({
      where: {
        id: existingUser.id,
      },
    });

    const totalBudget = await prisma.budget.aggregate({
      where: {
        userId: existingUser.id,
      },
      _sum: {
        amount: true,
      },
    });

    const currency = userSettings?.currency || "USD";

    return Response.json({
      total: totalBudget._sum.amount || 0,
      currency,
    });
  }

  return Response.json({ error: "User not found" }, { status: 404 });
}
