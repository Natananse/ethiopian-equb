import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/theme";
import { AppHeader } from "../layout/AppHeader";
import { DemoBanner } from "../layout/DemoBanner";

/** Standard tab-screen scaffold: themed safe area + brand header + demo banner. */
export function Screen({ children }: { children: React.ReactNode }) {
  const { colors } = useTheme();
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.brand }]} edges={["top", "left", "right"]}>
      <AppHeader />
      <DemoBanner />
      <View style={[styles.main, { backgroundColor: colors.background }]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  main: { flex: 1 },
});
