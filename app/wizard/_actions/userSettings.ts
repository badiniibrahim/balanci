"user server";

import prisma from "@/prisma/prisma";
import { UpdateUserCurrencySchema } from "@/schema/userSettings";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function updateUserCurrency(currency: string) {
  const parserBody = UpdateUserCurrencySchema.safeParse({ currency });

  if (!parserBody.success) {
    throw parserBody.error;
  }

  const user = await currentUser();
  if (!user) {
    return redirect("/sign-in");
  }

  const userSettings = await prisma.userSettings.update({
    where: {
      clerkId: user.id,
    },
    data: {
      currency: currency,
    },
  });

  return userSettings;
}
