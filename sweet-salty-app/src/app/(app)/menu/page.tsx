import Image from "next/image";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/lib/auth/options";
import { findUserById, getMenu } from "@/lib/mock-db";
import { localize, t } from "@/lib/i18n";

export default async function MenuPage() {
  const session = await getServerSession(authOptions);
  const profile = session?.user?.id ? await findUserById(session.user.id) : null;
  const locale = profile?.language ?? "ar";
  const categories = await getMenu();

  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold text-white">
          {t("menu", locale)}
        </h1>
        <p className="text-sm text-slate-300/80">
          {locale === "ar"
            ? "اختر قسمك المفضل واستمتع بتجربة حلو ومالح."
            : "Choose your favorite category and enjoy the Sweet & Salty experience."}
        </p>
      </div>

      <div className="space-y-10">
        {categories.map((category) => (
          <section key={category.id} className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  {localize(category.name, locale)}
                </h2>
                <p className="text-xs text-slate-300/80">
                  {localize(category.description, locale)}
                </p>
              </div>
              <Link
                href={`/menu/${category.id}`}
                className="text-xs text-orange-300 transition hover:text-orange-200"
              >
                {locale === "ar" ? "عرض المزيد" : "View more"}
              </Link>
            </div>
            <div className="space-y-3">
              {category.items.map((item) => (
                <Link
                  key={item.id}
                  href={`/menu/item/${item.id}`}
                  className="flex gap-4 rounded-3xl border border-white/10 bg-slate-900/70 p-4 shadow-lg transition hover:-translate-y-1 hover:border-orange-400/60 hover:shadow-orange-500/20"
                >
                  <Image
                    src={item.image}
                    alt={localize(item.name, locale)}
                    width={80}
                    height={80}
                    className="h-20 w-20 rounded-2xl object-cover"
                  />
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-white">
                        {localize(item.name, locale)}
                      </h3>
                      <p className="mt-1 text-xs text-slate-300/80">
                        {localize(item.description, locale)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-orange-300">
                        {item.price.toFixed(2)} ر.س
                      </span>
                      {item.discount > 0 ? (
                        <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-[11px] text-emerald-200">
                          {locale === "ar"
                            ? `خصم ${item.discount}%`
                            : `${item.discount}% off`}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
