"use client";

import Image from "next/image";
import Link from "next/link";
import { MenuItem, Locale } from "@/types";
import { localize, t } from "@/lib/i18n";
import { useCart } from "@/store/use-cart";

interface Props {
  item: MenuItem;
  locale: Locale;
}

export function MenuItemCard({ item, locale }: Props) {
  const addToCart = useCart((state) => state.addItem);

  return (
    <div className="group flex gap-4 rounded-3xl border border-white/10 bg-slate-900/70 p-4 shadow-lg transition hover:-translate-y-1 hover:border-orange-400/60 hover:shadow-orange-500/25">
      <Link href={`/menu/item/${item.id}`} className="flex-shrink-0 overflow-hidden rounded-2xl">
        <Image
          src={item.image}
          alt={localize(item.name, locale)}
          width={96}
          height={96}
          className="h-24 w-24 object-cover transition duration-500 group-hover:scale-105"
        />
      </Link>
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <Link href={`/menu/item/${item.id}`}>
            <h3 className="text-base font-semibold text-white">
              {localize(item.name, locale)}
            </h3>
          </Link>
          <p className="mt-1 text-xs text-slate-300/80">
            {localize(item.description, locale)}
          </p>
        </div>
        <div className="flex items-center justify-between pt-3">
          <div className="text-sm font-semibold text-orange-300">
            {item.price.toFixed(2)} ر.س
          </div>
          <button
            type="button"
            onClick={() => addToCart(item.id, 1)}
            className="rounded-full bg-orange-500/90 px-4 py-1.5 text-xs font-semibold text-white shadow-lg shadow-orange-500/30 transition hover:bg-orange-400"
          >
            {t("addToCart", locale)}
          </button>
        </div>
      </div>
    </div>
  );
}
