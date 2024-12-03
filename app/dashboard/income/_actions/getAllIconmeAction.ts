"use server";

import prisma from "@/prisma/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function GetIncomeForUser() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  return prisma.budget.findMany({
    where: { clerkId: userId },
    orderBy: { createdAt: "asc" },
  });
}
