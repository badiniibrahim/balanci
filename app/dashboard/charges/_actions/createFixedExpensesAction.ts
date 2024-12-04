"use server";

import prisma from "@/prisma/prisma";
import { FixedExpensesSchema, FixedExpensesType } from "@/schema/fixedExpenses";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function CreateFixedExpenses(from: FixedExpensesType) {
  const { success, data } = FixedExpensesSchema.safeParse(from);
  if (!success) {
    throw new Error("invalid form data");
  }

  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const existingUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (existingUser) {
    const result = await prisma.fixedExpense.create({
      data: {
        clerkId: userId,
        userId: existingUser.id,
        ...data,
        dueDate: new Date(),
      },
    });

    if (!result) {
      throw new Error("failed to create fixed expenses");
    }
  }
}
