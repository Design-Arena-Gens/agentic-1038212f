"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { usePreferences } from "@/store/use-preferences";
import { t } from "@/lib/i18n";

export default function RegisterPage() {
  const router = useRouter();
  const { locale, setLocale } = usePreferences();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, language: locale }),
      });
      if (!response.ok) {
        if (response.status === 409) {
          setError("البريد مستخدم مسبقاً");
        } else {
          setError("تعذر إنشاء الحساب");
        }
        setLoading(false);
        return;
      }
      await signIn("credentials", {
        redirect: false,
        email: form.email,
        password: form.password,
      });
      router.replace("/home");
    } catch (err) {
      console.error(err);
      setError("تعذر إنشاء الحساب");
      setLoading(false);
    }
  }

  return (
    <div className={locale === "ar" ? "rtl space-y-6" : "ltr space-y-6"}>
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold">{t("registerAccount", locale)}</h1>
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
            {t("name", locale)}
          </label>
          <input
            required
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            className="w-full rounded-2xl border border-slate-500/40 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-orange-400 focus:bg-slate-900"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm text-slate-300">
            {t("email", locale)}
          </label>
          <input
            type="email"
            dir="ltr"
            autoComplete="email"
            required
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            className="w-full rounded-2xl border border-slate-500/40 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-orange-400 focus:bg-slate-900"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm text-slate-300">
            {t("phone", locale)}
          </label>
          <input
            type="tel"
            dir="ltr"
            value={form.phone}
            onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
            className="w-full rounded-2xl border border-slate-500/40 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-orange-400 focus:bg-slate-900"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm text-slate-300">
            {t("password", locale)}
          </label>
          <input
            type="password"
            autoComplete="new-password"
            required
            value={form.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
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
          className="flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-sky-500 via-orange-500 to-fuchsia-500 px-4 py-3 text-sm font-bold text-white shadow-lg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? (
            <span className="animate-pulse">{t("register", locale)}...</span>
          ) : (
            t("register", locale)
          )}
        </button>
      </form>
      <div className="text-center text-xs text-slate-400">
        {t("alreadyHaveAccount", locale)}{" "}
        <Link href="/login" className="text-orange-300 transition hover:text-orange-200">
          {t("login", locale)}
        </Link>
      </div>
    </div>
  );
}
