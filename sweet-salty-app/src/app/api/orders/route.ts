import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth/options";
import { getMenuItemById, getOrdersForUser, saveOrder } from "@/lib/mock-db";

const orderSchema = z.object({
  items: z
    .array(
      z.object({
        itemId: z.string(),
        quantity: z.number().min(1),
      }),
    )
    .min(1),
  deliveryFee: z.number().min(0),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const orders = await getOrdersForUser(session.user.id);
  return NextResponse.json({ orders }, { status: 200 });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = orderSchema.parse(body);
    const resolvedItems = await Promise.all(
      parsed.items.map(async (entry) => {
        const menuItem = await getMenuItemById(entry.itemId);
        if (!menuItem) {
          throw new Error("ITEM_NOT_FOUND");
        }
        return {
          itemId: entry.itemId,
          quantity: entry.quantity,
          price: menuItem.price,
        };
      }),
    );
    const subtotal = resolvedItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );
    const total = subtotal + parsed.deliveryFee;
    const order = await saveOrder({
      userId: session.user.id,
      items: resolvedItems,
      subtotal,
      deliveryFee: parsed.deliveryFee,
      total,
    });
    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid payload", issues: error.issues },
        { status: 400 },
      );
    }
    if (error instanceof Error && error.message === "ITEM_NOT_FOUND") {
      return NextResponse.json({ message: "Item not found" }, { status: 404 });
    }
    return NextResponse.json(
      { message: "Failed to place order" },
      { status: 500 },
    );
  }
}
