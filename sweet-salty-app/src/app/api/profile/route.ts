import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth/options";
import { findUserById, updateUserProfile } from "@/lib/mock-db";

const updateSchema = z.object({
  name: z.string().min(2),
  phone: z.string().optional(),
  address: z.string().optional(),
  language: z.enum(["en", "ar"]),
  notifications: z.boolean(),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const user = await findUserById(session.user.id);
  if (!user) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }
  return NextResponse.json(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      language: user.language,
      notifications: user.notifications,
    },
    { status: 200 },
  );
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const parsed = updateSchema.parse(body);
    const updated = await updateUserProfile(session.user.id, parsed);
    return NextResponse.json(
      {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
        address: updated.address,
        language: updated.language,
        notifications: updated.notifications,
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
    return NextResponse.json(
      { message: "Failed to update profile" },
      { status: 500 },
    );
  }
}
