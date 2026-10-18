import { StyleSheet, Text, View } from "react-native";
import { spacing, useTheme } from "@/theme";
import { ThemeToggle } from "../ui/ThemeToggle";

export function AppHeader() {
  const { colors } = useTheme();
  return (
    <View style={[styles.header, { backgroundColor: colors.brand }]}>
      <View>
        <Text style={[styles.brand, { color: colors.onBrand }]}>EQUB</Text>
        <Text style={[styles.sub, { color: colors.onBrandMuted }]}>ETHIOPIAN SAVINGS CIRCLE</Text>
      </View>
      <View style={styles.right}>
        <ThemeToggle />
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
