import { StyleSheet, View } from "react-native";
import { useTheme } from "@/theme";

export function ProgressBar({ progress }: { progress: number }) {
  const { colors } = useTheme();
  const pct = Math.max(0, Math.min(100, progress));
  return (
    <View style={[styles.track, { backgroundColor: colors.surfaceAlt }]}>
      <View style={[styles.fill, { width: `${pct}%`, backgroundColor: colors.primary }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { height: 8, borderRadius: 9, overflow: "hidden" },
  fill: { height: 8, borderRadius: 9 },
});
