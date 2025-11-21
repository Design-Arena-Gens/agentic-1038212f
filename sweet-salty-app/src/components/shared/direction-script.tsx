"use client";

import { useEffect } from "react";
import { Locale } from "@/types";

const STORAGE_KEY = "sweet-salty-preferences";

export function DirectionScript() {
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        applyAttributes("ar");
        return;
      }
      const parsed = JSON.parse(stored) as { state?: { locale?: Locale } };
      const locale = parsed?.state?.locale ?? "ar";
      applyAttributes(locale);
    } catch {
      applyAttributes("ar");
    }
  }, []);

  return null;
}

function applyAttributes(locale: Locale) {
  const isArabic = locale === "ar";
  document.documentElement.lang = locale;
  document.documentElement.dir = isArabic ? "rtl" : "ltr";
  document.body.dataset.locale = locale;
  document.body.dataset.direction = isArabic ? "rtl" : "ltr";
}
