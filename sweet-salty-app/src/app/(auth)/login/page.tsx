"use client";

import { FormEvent, Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { usePreferences } from "@/store/use-preferences";
import { t } from "@/lib/i18n";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center text-sm text-slate-300">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { locale, setLocale } = usePreferences();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    setLoading(false);
    if (result?.error) {
      setError(t("failedAuth", locale));
      return;
    }
    router.replace(searchParams?.get("redirectTo") ?? "/home");
  }

  return (
    <div className={locale === "ar" ? "rtl space-y-6" : "ltr space-y-6"}>
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold">
          {t("welcome", locale)} 👋
        </h1>
        <button
          type="button"
          onClick={() => setLocale(locale === "ar" ? "en" : "ar")}
          className="rounded-full border border-slate-500/40 px-3 py-1 text-xs text-slate-200 transition hover:border-slate-300 hover:text-white"
        >
          {locale === "ar" ? t("languageEnglish", locale) : t("languageArabic", locale)}
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm text-slate-300">
            {t("email", locale)}
          </label>
          <input
            type="email"
            dir="ltr"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-2xl border border-slate-500/40 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-orange-400 focus:bg-slate-900"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm text-slate-300">
            {t("password", locale)}
          </label>
          <input
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-2xl border border-slate-500/40 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-orange-400 focus:bg-slate-900"
          />
        </div>
        {error ? (
          <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-orange-500 via-fuchsia-500 to-sky-500 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? (
            <span className="animate-pulse">{t("login", locale)}...</span>
          ) : (
            t("login", locale)
          )}
        </button>
      </form>

      <div className="flex flex-col gap-3 text-center text-xs text-slate-300">
        <Link
          href="/forgot-password"
          className="text-orange-300 transition hover:text-orange-200"
        >
          {t("forgotPassword", locale)}
        </Link>
        <div className="text-slate-400">
          {t("noAccount", locale)}{" "}
          <Link href="/register" className="text-orange-300 transition hover:text-orange-200">
            {t("register", locale)}
          </Link>
        </div>
      </div>
    </div>
  );
}
