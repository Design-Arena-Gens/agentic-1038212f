"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  UtensilsCrossed,
  ShoppingBag,
  Settings,
} from "lucide-react";
import clsx from "clsx";
import { t } from "@/lib/i18n";
import { Locale } from "@/types";

interface BottomNavigationProps {
  locale: Locale;
  cartCount: number;
}

const items = [
  { href: "/home", icon: Home, key: "home" },
  { href: "/menu", icon: UtensilsCrossed, key: "menu" },
  { href: "/cart", icon: ShoppingBag, key: "cart" },
  { href: "/settings", icon: Settings, key: "settings" },
];

export function BottomNavigation({ locale, cartCount }: BottomNavigationProps) {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-5 left-1/2 z-50 w-[min(90%,420px)] -translate-x-1/2 rounded-3xl border border-white/10 bg-slate-900/80 px-3 py-3 shadow-2xl backdrop-blur-2xl">
      <ul className="flex items-center justify-between gap-2">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname.startsWith(item.href);
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className={clsx(
                  "flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-xs font-medium transition",
                  active
                    ? "bg-gradient-to-br from-orange-500/60 via-fuchsia-500/50 to-sky-500/50 text-white shadow-lg"
                    : "text-slate-300 hover:text-white",
                )}
              >
                <span className="relative">
                  <Icon className="h-5 w-5" strokeWidth={2} />
                  {item.key === "cart" && cartCount > 0 ? (
                    <span className="absolute -right-2 -top-2 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[11px] font-semibold text-white">
                      {cartCount}
                    </span>
                  ) : null}
                </span>
                <span>{t(item.key as never, locale)}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
