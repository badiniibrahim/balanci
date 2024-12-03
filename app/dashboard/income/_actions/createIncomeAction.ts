"use server";

import prisma from "@/prisma/prisma";
import { IncomeSchema, IncomeSchemaType } from "@/schema/income";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function CreateIncome(from: IncomeSchemaType) {
  const { success, data } = IncomeSchema.safeParse(from);
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

  const result = await prisma.budget.create({
    data: {
      clerkId: userId,
      userId: existingUser?.id,
      ...data,
    },
  });

  if (!result) {
    throw new Error("failed to create income");
  }

  revalidatePath("/dashboard/income");
}
