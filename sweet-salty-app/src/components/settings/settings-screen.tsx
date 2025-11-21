"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { UserProfile } from "@/types";
import { usePreferences } from "@/store/use-preferences";
import { t } from "@/lib/i18n";

interface SettingsScreenProps {
  profile: UserProfile;
}

export function SettingsScreen({ profile }: SettingsScreenProps) {
  const { locale, setPreferences, notifications } = usePreferences();
  const [status, setStatus] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    setPreferences(profile.language, profile.notifications);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.language, profile.notifications]);

  async function updateProfile(nextLocale = locale, nextNotifications = notifications) {
    setUpdating(true);
    setStatus(null);
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.name,
          phone: profile.phone,
          address: profile.address,
          language: nextLocale,
          notifications: nextNotifications,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update");
      }
      setPreferences(nextLocale, nextNotifications);
      setStatus(t("successProfile", nextLocale));
    } catch {
      setStatus(t("failedProfile", locale));
    } finally {
      setUpdating(false);
    }
  }

  const directionsClass = locale === "ar" ? "rtl" : "ltr";

  return (
    <div className={clsx("space-y-8", directionsClass)}>
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold text-white">{t("settings", locale)}</h1>
        <p className="text-sm text-slate-300/80">
          {locale === "ar"
            ? "قم بتخصيص تجربتك باختيار اللغة وتفعيل الإشعارات."
            : "Personalize your experience by adjusting language and notifications."}
        </p>
      </div>
      <div className="space-y-6 rounded-3xl border border-white/10 bg-slate-900/70 p-6">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-white">{t("language", locale)}</h2>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => updateProfile("ar", notifications)}
              className={clsx(
                "flex-1 rounded-2xl px-4 py-3 text-sm font-semibold transition",
                locale === "ar"
                  ? "bg-orange-500/80 text-white shadow-lg"
                  : "bg-slate-800/50 text-slate-300 hover:bg-slate-800/70",
              )}
            >
              {t("languageArabic", locale)}
            </button>
            <button
              type="button"
              onClick={() => updateProfile("en", notifications)}
              className={clsx(
                "flex-1 rounded-2xl px-4 py-3 text-sm font-semibold transition",
                locale === "en"
                  ? "bg-orange-500/80 text-white shadow-lg"
                  : "bg-slate-800/50 text-slate-300 hover:bg-slate-800/70",
              )}
            >
              {t("languageEnglish", locale)}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl bg-slate-950/50 px-4 py-4">
          <div>
            <p className="text-sm font-semibold text-white">{t("notifications", locale)}</p>
            <p className="text-xs text-slate-300/80">
              {locale === "ar"
                ? "استقبل آخر العروض والتنبيهات."
                : "Receive latest offers and alerts."}
            </p>
          </div>
          <button
            type="button"
            aria-pressed={notifications}
            onClick={() => {
              updateProfile(locale, !notifications);
            }}
            className={clsx(
              "relative h-9 w-16 rounded-full transition",
              notifications ? "bg-emerald-500" : "bg-slate-700",
            )}
          >
            <span
              className={clsx(
                "absolute top-1/2 h-7 w-7 -translate-y-1/2 rounded-full bg-white shadow-lg transition",
                notifications ? "right-1" : "left-1",
              )}
            />
          </button>
        </div>

        <div className="rounded-2xl bg-slate-950/60 p-5 text-sm text-slate-200/85">
          <h3 className="text-base font-semibold text-white">{t("contactUs", locale)}</h3>
          <p className="mt-2">
            {locale === "ar"
              ? "واتساب: 920000000\nالبريد: support@sweet-salty.app"
              : "WhatsApp: 920000000\nEmail: support@sweet-salty.app"}
          </p>
        </div>

        <div className="rounded-2xl bg-slate-950/60 p-5 text-sm text-slate-200/85">
          <h3 className="text-base font-semibold text-white">{t("about", locale)}</h3>
          <p className="mt-2">
            {locale === "ar"
              ? "حلو ومالح يجمع بين النكهات الشرقية والغربية لتجربة طعام فريدة. التطبيق يتيح لك تصفح القائمة، حفظ التفضيلات، وإتمام الطلبات بسهولة."
              : "Sweet & Salty blends oriental and western flavors for a unique dining experience. The app lets you browse the menu, save preferences, and place orders effortlessly."}
          </p>
        </div>
      </div>
      {status ? (
        <p className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-center text-xs text-slate-200">
          {updating ? `${status}...` : status}
        </p>
      ) : null}
    </div>
  );
}
