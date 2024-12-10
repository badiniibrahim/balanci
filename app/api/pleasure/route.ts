import { NextResponse } from "next/server";
import prisma from "@/prisma/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

      const pleasure = await prisma.pleasure.findMany({
        where: { clerkId: user?.id },
        orderBy: { createdAt: "asc" },
      });

      const currency = userSettings?.currency || "USD";

      return Response.json({
        pleasure: pleasure,
        currency,
      });
    }

    return Response.json({ error: "User not found" }, { status: 404 });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
