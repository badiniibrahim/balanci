import prisma from "@/prisma/prisma";
import { inngest } from "./client";

export const createUser = inngest.createFunction(
  { id: "create new user" },
  { event: "create.new.user" },
  async ({ event, step }) => {
    await step.run("Check User and create New if not in DB ", async () => {
      const user = event.data?.user;
      const email = user?.primaryEmailAddress?.emailAddress || "";
      const fullName = user?.fullName || "";

      if (!email || !fullName) {
        throw new Error(
          "L'utilisateur doit avoir une adresse email et un nom complet."
        );
      }

      const existingUser = await prisma.user.findUnique({
        where: { clerkId: user.id },
      });

      if (existingUser == null) {
        const newUser = await prisma.user.create({
          data: {
            clerkId: user.id,
            email: email,
            name: fullName,
          },
        });
        if (newUser) {
          await prisma.budgetRule.create({
            data: {
              needsPercentage: 50,
              wantsPercentage: 30,
              savingsPercentage: 20,
              clerkId: user.id,
              userId: newUser.id,
            },
          });
        }
      }
    });
    return "Success";
  }
);
