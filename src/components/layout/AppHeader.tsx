import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "@/core/i18n";
import { spacing, useTheme } from "@/theme";
import { ThemeToggle } from "../ui/ThemeToggle";

export function AppHeader() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  return (
    <View style={[styles.header, { backgroundColor: colors.brand }]}>
      <View>
        <Text style={[styles.brand, { color: colors.onBrand }]}>EQUB</Text>
        <Text style={[styles.sub, { color: colors.onBrandMuted }]}>ETHIOPIAN SAVINGS CIRCLE</Text>
      </View>
      <View style={styles.right}>
        <ThemeToggle />
        <Pressable
          accessibilityLabel={t.settings}
          accessibilityRole="button"
          onPress={() => router.push("/settings")}
          style={[styles.settingsButton, { borderColor: colors.onBrandMuted }]}
        >
          <Ionicons name="settings-outline" size={18} color={colors.onBrand} />
        </Pressable>
        <View style={[styles.livePill, { borderColor: colors.onBrandMuted }]}>
          <View style={[styles.liveDot, { backgroundColor: colors.accent }]} />
          <Text style={[styles.liveText, { color: colors.onBrand }]}>DEMO</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: 10,
    paddingBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  brand: { fontSize: 28, fontWeight: "900", letterSpacing: 4 },
  sub: { fontSize: 9, letterSpacing: 1.6, marginTop: 2 },
  right: { flexDirection: "row", alignItems: "center", gap: 8 },
  settingsButton: {
    width: 34,
    height: 34,
    borderWidth: 1,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  livePill: {
    borderWidth: 1,
    borderRadius: 30,
    paddingHorizontal: 10,
    paddingVertical: 7,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  liveDot: { width: 7, height: 7, borderRadius: 4 },
  liveText: { fontWeight: "800", fontSize: 10, letterSpacing: 1 },
});
