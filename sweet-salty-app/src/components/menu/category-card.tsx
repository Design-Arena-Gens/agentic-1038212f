"use client";

import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { Category, Locale } from "@/types";
import { localize } from "@/lib/i18n";

interface Props {
  category: Category;
  locale: Locale;
  className?: string;
}

export function CategoryCard({ category, locale, className }: Props) {
  const cover = category.items[0]?.image ?? "/logo.svg";
  return (
    <Link
      href={`/menu/${category.id}`}
      className={clsx(
        "group relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 shadow-xl transition hover:-translate-y-1 hover:border-orange-400/60 hover:shadow-orange-500/20",
        className,
      )}
    >
      <div className="h-36 w-full overflow-hidden">
        <Image
          src={cover}
          alt={localize(category.name, locale)}
          width={320}
          height={160}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
      </div>
      <div className="space-y-2 p-5">
        <h3 className="text-lg font-semibold text-white">
          {localize(category.name, locale)}
        </h3>
        <p className="text-xs text-slate-300/80">
          {localize(category.description, locale)}
        </p>
      </div>
    </Link>
  );
}
