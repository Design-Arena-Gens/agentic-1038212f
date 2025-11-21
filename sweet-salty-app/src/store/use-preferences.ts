import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Locale } from "@/types";

interface PreferencesState {
  locale: Locale;
  notifications: boolean;
  setLocale: (locale: Locale) => void;
  toggleNotifications: () => void;
  setPreferences: (locale: Locale, notifications: boolean) => void;
}

export const usePreferences = create<PreferencesState>()(
  persist(
    (set) => ({
      locale: "ar",
      notifications: true,
      setLocale: (locale) => set({ locale }),
      toggleNotifications: () =>
        set((state) => ({ notifications: !state.notifications })),
      setPreferences: (locale, notifications) =>
        set({ locale, notifications }),
    }),
    {
      name: "sweet-salty-preferences",
    },
  ),
);
