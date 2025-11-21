"use client";

import Image from "next/image";
import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { MenuItem, Locale } from "@/types";
import { localize, t } from "@/lib/i18n";
import { useCart } from "@/store/use-cart";

interface ItemDetailProps {
  item: MenuItem;
  locale: Locale;
}

export function ItemDetail({ item, locale }: ItemDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const addToCart = useCart((state) => state.addItem);

  function increment() {
    setQuantity((prev) => prev + 1);
  }

  function decrement() {
    setQuantity((prev) => (prev > 1 ? prev - 1 : prev));
  }

  function handleAdd() {
    addToCart(item.id, quantity);
  }

  return (
    <div className="space-y-6">
      <div className="relative h-72 overflow-hidden rounded-4xl border border-white/20">
        <Image
          src={item.image}
          alt={localize(item.name, locale)}
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="space-y-4 rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">
              {localize(item.name, locale)}
            </h1>
            <p className="mt-2 text-sm text-slate-300/80">
              {localize(item.description, locale)}
            </p>
          </div>
          <div className="rounded-full bg-orange-500/20 px-4 py-1 text-sm font-semibold text-orange-200">
            {item.price.toFixed(2)} ر.س
          </div>
        </div>
        <div>
          <h2 className="text-base font-semibold text-white">
            {t("ingredients", locale)}
          </h2>
          <ul className="mt-3 grid gap-2 text-sm text-slate-200/85 md:grid-cols-2">
            {item.ingredients.map((ingredient, index) => (
              <li
                key={`${ingredient.en}-${index}`}
                className="flex items-center gap-2 rounded-xl bg-slate-800/60 px-3 py-2"
              >
                <span className="h-2 w-2 rounded-full bg-orange-400" />
                {localize(ingredient, locale)}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-4 rounded-3xl border border-white/5 bg-slate-950/80 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-slate-200/70">
              {t("quantity", locale)}
            </p>
            <div className="mt-2 inline-flex items-center gap-4 rounded-full border border-white/10 bg-slate-900/60 px-4 py-2">
              <button
                type="button"
                onClick={decrement}
                className="rounded-full bg-slate-800/80 p-2 text-white transition hover:bg-orange-500/40"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="min-w-[2ch] text-center text-lg font-semibold text-white">
                {quantity}
              </span>
              <button
                type="button"
                onClick={increment}
                className="rounded-full bg-slate-800/80 p-2 text-white transition hover:bg-orange-500/40"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className="flex flex-1 items-center justify-center rounded-2xl bg-gradient-to-r from-orange-500/90 via-fuchsia-500/80 to-sky-500/80 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 transition hover:opacity-90"
          >
            {t("addToCart", locale)}
          </button>
        </div>
      </div>
    </div>
  );
}
