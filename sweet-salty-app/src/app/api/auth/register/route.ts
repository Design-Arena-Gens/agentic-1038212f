import { NextResponse } from "next/server";
import { z } from "zod";
import { createUser } from "@/lib/mock-db";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  phone: z.string().optional(),
  language: z.enum(["en", "ar"]).optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.parse(body);
    const user = await createUser(parsed);
    return NextResponse.json(
      { id: user.id, email: user.email, name: user.name },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid payload", issues: error.issues },
        { status: 400 },
      );
    }
    if (error instanceof Error && error.message === "USER_EXISTS") {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { message: "Failed to register user" },
      { status: 500 },
    );
  }
}
