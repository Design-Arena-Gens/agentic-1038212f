import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { findUserById, getMenuItemById } from "@/lib/mock-db";
import { ItemDetail } from "@/components/menu/item-detail";

interface ItemPageProps {
  params: { itemId: string };
}

export default async function ItemPage({ params }: ItemPageProps) {
  const session = await getServerSession(authOptions);
  const profile = session?.user?.id ? await findUserById(session.user.id) : null;
  const locale = profile?.language ?? "ar";
  const item = await getMenuItemById(params.itemId);

  if (!item) {
    notFound();
  }

  return <ItemDetail item={item} locale={locale} />;
}
