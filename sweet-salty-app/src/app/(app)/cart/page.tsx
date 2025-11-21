import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { findUserById, getMenu } from "@/lib/mock-db";
import { CartScreen } from "@/components/cart/cart-screen";

export default async function CartPage() {
  const session = await getServerSession(authOptions);
  const profile = session?.user?.id ? await findUserById(session.user.id) : null;
  const locale = profile?.language ?? "ar";
  const categories = await getMenu();
  const catalog = categories.flatMap((category) => category.items);

  return <CartScreen locale={locale} catalog={catalog} />;
}
