"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { usePreferences } from "@/store/use-preferences";
import { t } from "@/lib/i18n";

export default function ForgotPasswordPage() {
  const { locale } = usePreferences();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    await fetch("/api/auth/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setLoading(false);
    setMessage(t("resetLinkSent", locale));
  }

  return (
    <div className={locale === "ar" ? "rtl space-y-6" : "ltr space-y-6"}>
      <h1 className="text-2xl font-semibold">{t("forgotPassword", locale)}</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm text-slate-300">
            {t("email", locale)}
          </label>
          <input
            type="email"
            dir="ltr"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-2xl border border-slate-500/40 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-orange-400 focus:bg-slate-900"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-purple-500 to-orange-500 px-4 py-3 text-sm font-bold text-white shadow-lg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? (
            <span className="animate-pulse">{t("sendResetLink", locale)}...</span>
          ) : (
            t("sendResetLink", locale)
          )}
        </button>
      </form>
      {message ? (
        <p className="rounded-xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          {message}
        </p>
      ) : null}
      <div className="text-center text-xs text-slate-400">
        <Link href="/login" className="text-orange-300 transition hover:text-orange-200">
          {t("login", locale)}
        </Link>
      </div>
    </div>
  );
}
