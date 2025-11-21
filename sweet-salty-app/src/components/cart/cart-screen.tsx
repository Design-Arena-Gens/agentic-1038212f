"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
import { MenuItem, Locale } from "@/types";
import { useCart } from "@/store/use-cart";
import { localize, t } from "@/lib/i18n";

interface CartScreenProps {
  locale: Locale;
  catalog: MenuItem[];
}

const DELIVERY_FEE = 12;

export function CartScreen({ locale, catalog }: CartScreenProps) {
  const { items, setQuantity, removeItem, clear } = useCart();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const detailedItems = useMemo(() => {
    return items
      .map((entry) => {
        const menuItem = catalog.find((item) => item.id === entry.itemId);
        if (!menuItem) {
          return null;
        }
        const price =
          menuItem.discount > 0
            ? menuItem.price * (1 - menuItem.discount / 100)
            : menuItem.price;
        return {
          ...entry,
          menu: menuItem,
          price,
          total: price * entry.quantity,
        };
      })
      .filter(Boolean) as {
      itemId: string;
      quantity: number;
      menu: MenuItem;
      price: number;
      total: number;
    }[];
  }, [items, catalog]);

  const subtotal = detailedItems.reduce((sum, entry) => sum + entry.total, 0);
  const deliveryFee = detailedItems.length > 0 ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;

  async function handleCheckout() {
    setLoading(true);
    setMessage(null);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((entry) => ({
            itemId: entry.itemId,
            quantity: entry.quantity,
          })),
          deliveryFee,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to checkout");
      }
      clear();
      setMessage(t("orderPlaced", locale));
    } catch {
      setMessage(locale === "ar" ? "تعذّر تنفيذ الطلب حالياً" : "Unable to place order now.");
    } finally {
      setLoading(false);
    }
  }

  if (detailedItems.length === 0) {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center gap-4 rounded-3xl border border-white/10 bg-slate-900/60 p-8 text-center">
        <Image
          src="/logo.svg"
          alt="حلو ومالح"
          width={64}
          height={64}
          className="h-16 w-16 opacity-80"
          priority
        />
        <p className="text-sm text-slate-300/80">{t("cartEmpty", locale)}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold text-white">{t("cart", locale)}</h1>
        <p className="text-sm text-slate-300/80">
          {locale === "ar"
            ? "راجع طلبك قبل الإتمام. يمكنك تعديل العناصر أو إزالتها."
            : "Review your order before completing. You can adjust or remove items."}
        </p>
      </div>
      <div className="space-y-4">
        {detailedItems.map((entry) => (
          <div
            key={entry.itemId}
            className="flex gap-4 rounded-3xl border border-white/10 bg-slate-900/70 p-4 shadow-lg"
          >
            <Image
              src={entry.menu.image}
              alt={localize(entry.menu.name, locale)}
              width={80}
              height={80}
              className="h-20 w-20 rounded-2xl object-cover"
            />
            <div className="flex flex-1 flex-col gap-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-white">
                    {localize(entry.menu.name, locale)}
                  </h3>
                  <p className="text-xs text-slate-300/80">{entry.price.toFixed(2)} ر.س</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(entry.itemId)}
                  className="rounded-full bg-red-500/20 p-2 text-red-200 transition hover:bg-red-500/40"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-slate-900/60 px-4 py-2 text-sm">
                  <button
                    type="button"
                    onClick={() => setQuantity(entry.itemId, entry.quantity - 1)}
                    className="text-white transition hover:text-orange-300"
                  >
                    -
                  </button>
                  <span className="min-w-[2ch] text-center">{entry.quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(entry.itemId, entry.quantity + 1)}
                    className="text-white transition hover:text-orange-300"
                  >
                    +
                  </button>
                </div>
                <div className="text-sm font-semibold text-orange-300">
                  {entry.total.toFixed(2)} ر.س
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3 rounded-3xl border border-white/10 bg-slate-900/70 p-5">
        <div className="flex items-center justify-between text-sm text-slate-300/80">
          <span>{t("subtotal", locale)}</span>
          <span>{subtotal.toFixed(2)} ر.س</span>
        </div>
        <div className="flex items-center justify-between text-sm text-slate-300/80">
          <span>{t("deliveryFee", locale)}</span>
          <span>{deliveryFee.toFixed(2)} ر.س</span>
        </div>
        <hr className="border-slate-800" />
        <div className="flex items-center justify-between text-base font-semibold text-white">
          <span>{t("total", locale)}</span>
          <span>{total.toFixed(2)} ر.س</span>
        </div>
        <button
          type="button"
          onClick={handleCheckout}
          disabled={loading}
          className="mt-4 flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-orange-500/90 via-fuchsia-500/80 to-sky-500/80 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? t("checkout", locale) + "..." : t("checkout", locale)}
        </button>
      </div>
      {message ? (
        <p className="rounded-3xl border border-emerald-400/40 bg-emerald-500/10 px-4 py-3 text-center text-sm text-emerald-200">
          {message}
        </p>
      ) : null}
    </div>
  );
}
