import { NextResponse } from "next/server";
import { z } from "zod";
import { findUserByEmail } from "@/lib/mock-db";

const schema = z.object({
  email: z.string().email(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.parse(body);
    const user = await findUserByEmail(parsed.email);
    // In a real integration we would trigger Supabase/Firebase password reset.
    // For the mock backend we simply acknowledge the request.
    return NextResponse.json(
      {
        found: Boolean(user),
        message: "Reset instructions dispatched if the account exists.",
      },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid payload", issues: error.issues },
        { status: 400 },
      );
    }
    return NextResponse.json({ message: "Failed to process request" }, { status: 500 });
  }
}
