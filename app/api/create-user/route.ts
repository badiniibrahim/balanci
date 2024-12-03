import { NextResponse } from "next/server";
import { inngest } from "../inngest/client";

export async function POST(request: Request) {
  const { user } = await request.json();
  const result = await inngest.send({
    name: "create.new.user",
    data: {
      user: user,
    },
  });
  return NextResponse.json(result);
}
