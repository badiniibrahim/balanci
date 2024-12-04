"use server";

import prisma from "@/prisma/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function GetFixedExpenses() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  return prisma.fixedExpense.findMany({
    where: { clerkId: userId },
    orderBy: { createdAt: "asc" },
  });
}
