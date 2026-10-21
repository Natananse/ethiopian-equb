import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "@/core/i18n";
import { spacing, useTheme } from "@/theme";

export function AppHeader() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  return (
    <View style={[styles.header, { backgroundColor: colors.brand }]}>
      <View>
        <View style={styles.brandRow}>
          <View style={[styles.brandMark, { backgroundColor: colors.accent }]}>
            <Ionicons name="leaf" size={17} color={colors.brandDeep} />
          </View>
          <Text style={[styles.brand, { color: colors.onBrand }]}>EQUB</Text>
        </View>
        <Text style={[styles.sub, { color: colors.onBrandMuted }]}>ETHIOPIAN SAVINGS CIRCLE</Text>
      </View>
      <View style={styles.right}>
        <Pressable
          accessibilityLabel={t.settings}
          accessibilityRole="button"
          onPress={() => router.push("/settings")}
          style={[styles.settingsButton, { backgroundColor: "rgba(255,255,255,0.12)" }]}
        >
          <Ionicons name="settings-outline" size={20} color={colors.onBrand} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: 14,
    paddingBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  brandMark: { width: 29, height: 29, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  brand: { fontSize: 20, fontWeight: "900", letterSpacing: 3 },
  sub: { fontSize: 8, letterSpacing: 1.35, marginTop: 4, marginLeft: 37 },
  right: { flexDirection: "row", alignItems: "center", gap: 8 },
  settingsButton: {
    width: 42,
    height: 42,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
});
