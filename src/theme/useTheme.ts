import { useColorScheme } from "react-native";
import { resolveTheme, useSettingsStore, type ResolvedTheme, type ThemeMode } from "@/store/useSettingsStore";
import { darkColors, lightColors, type ThemeColors } from "./colors";

export interface Theme {
  colors: ThemeColors;
  resolved: ResolvedTheme;
  mode: ThemeMode;
  isDark: boolean;
}

/** Single source of truth for theming: persisted mode + OS scheme -> palette. */
export function useTheme(): Theme {
  const themeMode = useSettingsStore((s) => s.themeMode);
  const systemScheme = useColorScheme();
  const resolved = resolveTheme(themeMode, systemScheme);
  return {
    colors: resolved === "dark" ? darkColors : lightColors,
    resolved,
    mode: themeMode,
    isDark: resolved === "dark",
  };
}
