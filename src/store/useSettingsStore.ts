import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Language } from "@/core/i18n/translations";

export type ThemeMode = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

interface SettingsState {
  language: Language;
  themeMode: ThemeMode;
  setLanguage: (language: Language) => void;
  setThemeMode: (themeMode: ThemeMode) => void;
  /** Flip between light and dark based on the currently resolved theme. */
  toggleTheme: (resolved: ResolvedTheme) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      // The legacy app booted in Amharic; keep that default.
      language: "am",
      themeMode: "system",
      setLanguage: (language) => set({ language }),
      setThemeMode: (themeMode) => set({ themeMode }),
      toggleTheme: (resolved) => set({ themeMode: resolved === "dark" ? "light" : "dark" }),
    }),
    {
      name: "ethiopian-equb-settings-v1",
      storage: createJSONStorage(() => AsyncStorage),
      // No partialize: JSON.stringify drops the action functions, and the
      // default shallow merge restores them from the initial state on hydrate.
    }
  )
);

/** Resolve the effective theme from the stored mode + the OS color scheme. */
export function resolveTheme(themeMode: ThemeMode, systemScheme: string | null | undefined): ResolvedTheme {
  if (themeMode === "system") return systemScheme === "dark" ? "dark" : "light";
  return themeMode;
}
