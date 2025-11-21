"use client";

import Image from "next/image";
import Link from "next/link";
import { ReactNode, useEffect } from "react";
import clsx from "clsx";
import { Locale } from "@/types";
import { usePreferences } from "@/store/use-preferences";
import { BottomNavigation } from "@/components/layout/bottom-navigation";
import { t } from "@/lib/i18n";
import { useCart } from "@/store/use-cart";

interface AppShellProps {
  children: ReactNode;
  locale: Locale;
  userName: string;
}

export function AppShell({ children, locale, userName }: AppShellProps) {
  const { locale: storedLocale, setLocale } = usePreferences();
  const { items } = useCart();

  useEffect(() => {
    if (storedLocale !== locale) {
      setLocale(locale);
    }
  }, [locale, setLocale, storedLocale]);

  const directionClass = locale === "ar" ? "rtl" : "ltr";
  const cartCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className={clsx("flex min-h-screen flex-col bg-slate-950 pb-24", directionClass)}>
      <header className="relative overflow-hidden rounded-b-[3rem] bg-gradient-to-br from-orange-500/30 via-fuchsia-500/20 to-sky-500/20 px-6 pb-12 pt-14">
        <div className="absolute inset-0">
          <div className="absolute -left-16 top-6 h-44 w-44 rounded-full bg-orange-500/40 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-sky-500/30 blur-3xl" />
        </div>
        <div className="relative flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-slate-200/70">
              {t("appName", locale)}
            </p>
            <h1 className="mt-3 text-3xl font-bold text-white">
              {locale === "ar" ? `مرحباً ${userName || "بك"}!` : `Welcome ${userName || "back"}!`}
            </h1>
            <p className="mt-2 max-w-sm text-sm text-slate-200/80">
              {locale === "ar"
                ? "استكشف قائمتنا المتنوعة واستفد من أفضل العروض."
              : "Explore our vibrant menu and take advantage of exclusive offers."}
            </p>
          </div>
          <div className="flex flex-col items-end gap-3">
            <Link
              href="/profile"
              className="rounded-full border border-white/30 bg-slate-900/60 px-4 py-2 text-xs font-semibold text-white shadow-lg transition hover:border-orange-400 hover:text-orange-100"
            >
              {t("profile", locale)}
            </Link>
            <Image
              src="/logo.svg"
              alt="حلو ومالح"
              width={64}
              height={64}
              className="h-16 w-16 rounded-2xl border border-white/30 bg-slate-900/60 p-2 shadow-lg"
              priority
            />
          </div>
        </div>
      </header>
      <main className="flex-1 px-6 py-8">{children}</main>
      <BottomNavigation locale={locale} cartCount={cartCount} />
    </div>
  );
}
