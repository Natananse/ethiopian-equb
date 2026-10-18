import { Pressable, StyleSheet, Text } from "react-native";
import { useTranslation } from "@/core/i18n";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useTheme } from "@/theme";

/**
 * Dark / light toggler. Writes an explicit mode (not "system") so the user's
 * tap always wins over the OS setting; Settings offers Light / Dark / System.
 */
export function ThemeToggle() {
  const { colors, resolved } = useTheme();
  const { t } = useTranslation();
  const toggleTheme = useSettingsStore((s) => s.toggleTheme);
  const isDark = resolved === "dark";
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t.themeToggle}
      onPress={() => toggleTheme(resolved)}
      style={[styles.pill, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}
    >
      <Text style={styles.icon}>{isDark ? "☾" : "☀"}</Text>
      <Text style={[styles.label, { color: colors.text }]}>{isDark ? t.themeDark : t.themeLight}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderRadius: 30,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  icon: { fontSize: 14 },
  label: { fontSize: 11, fontWeight: "800" },
});
