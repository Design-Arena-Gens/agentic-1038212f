import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/lib/auth/options";
import { findUserById, getMenu, getMostOrdered, getOffers } from "@/lib/mock-db";
import { CategoryCard } from "@/components/menu/category-card";
import { MenuItemCard } from "@/components/menu/menu-item-card";
import { OfferCard } from "@/components/menu/offer-card";
import { t } from "@/lib/i18n";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const profile = session?.user?.id ? await findUserById(session.user.id) : null;
  const locale = profile?.language ?? "ar";
  const [categories, mostOrdered, offers] = await Promise.all([
    getMenu(),
    getMostOrdered(),
    getOffers(),
  ]);

  return (
    <div className="space-y-10">
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            {t("categories", locale)}
          </h2>
          <Link
            href="/menu"
            className="text-xs text-orange-300 transition hover:text-orange-200"
          >
            {locale === "ar" ? "عرض الكل" : "View all"}
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              locale={locale}
            />
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            {t("mostPopular", locale)}
          </h2>
        </div>
        <div className="flex snap-x gap-4 overflow-x-auto pb-2">
          {mostOrdered.map((item) => (
            <div key={item.id} className="min-w-[260px] snap-start">
              <MenuItemCard item={item} locale={locale} />
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-white">
          {t("offersDiscounts", locale)}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {offers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} locale={locale} />
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-inner shadow-orange-500/10">
        <h3 className="text-lg font-semibold text-white">
          {locale === "ar"
            ? "تواصل معنا"
            : "Get in touch"}
        </h3>
        <p className="text-sm text-slate-300/80">
          {locale === "ar"
            ? "للطلبات الخاصة أو خدمات المناسبات، تواصل معنا عبر واتساب 920000000 أو البريد support@sweet-salty.app"
            : "For special orders or catering, reach us on WhatsApp 920000000 or email support@sweet-salty.app"}
        </p>
      </section>
    </div>
  );
}
