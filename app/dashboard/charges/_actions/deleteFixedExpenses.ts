"use server";

import prisma from "@/prisma/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function DeleteFixedExpenses(id: number) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const existingUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  await prisma.fixedExpense.delete({
    where: {
      clerkId: userId,
      userId: existingUser?.id,
      id,
    },
  });

  revalidatePath("/dashboard/income");
}
