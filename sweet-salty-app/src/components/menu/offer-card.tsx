"use client";

import Image from "next/image";
import clsx from "clsx";
import { Offer, Locale } from "@/types";
import { localize } from "@/lib/i18n";

interface OfferCardProps {
  offer: Offer;
  locale: Locale;
  className?: string;
}

export function OfferCard({ offer, locale, className }: OfferCardProps) {
  return (
    <div
      className={clsx(
        "group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-orange-500/40 via-fuchsia-500/30 to-sky-500/30 p-5 shadow-xl transition hover:-translate-y-1 hover:shadow-orange-500/30",
        className,
      )}
    >
      <Image
        src={offer.image}
        alt={localize(offer.title, locale)}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover opacity-30"
      />
      <div className="relative space-y-2">
        <p className="text-xs uppercase tracking-widest text-white/75">
          {locale === "ar" ? "عرض حصري" : "Exclusive"}
        </p>
        <h3 className="text-lg font-bold text-white">
          {localize(offer.title, locale)}
        </h3>
        <p className="text-sm text-slate-100/90">
          {localize(offer.description, locale)}
        </p>
      </div>
    </div>
  );
}
