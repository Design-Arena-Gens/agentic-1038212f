import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { findUserById, getMenu } from "@/lib/mock-db";
import { MenuItemCard } from "@/components/menu/menu-item-card";
import { localize } from "@/lib/i18n";

interface CategoryPageProps {
  params: { categoryId: string };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const session = await getServerSession(authOptions);
  const profile = session?.user?.id ? await findUserById(session.user.id) : null;
  const locale = profile?.language ?? "ar";
  const categories = await getMenu();
  const category = categories.find((entry) => entry.id === params.categoryId);

  if (!category) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold text-white">
          {localize(category.name, locale)}
        </h1>
        <p className="text-sm text-slate-300/80">
          {localize(category.description, locale)}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {category.items.map((item) => (
          <MenuItemCard key={item.id} item={item} locale={locale} />
        ))}
      </div>
    </div>
  );
}
