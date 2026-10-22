import { StyleSheet, View } from "react-native";
import { useTheme } from "@/theme";

export function ProgressBar({ progress, color, trackColor }: { progress: number; color?: string; trackColor?: string }) {
  const { colors } = useTheme();
  const pct = Math.max(0, Math.min(100, progress));
  return (
    <View style={[styles.track, { backgroundColor: trackColor ?? colors.surfaceAlt }]}>
      <View style={[styles.fill, { width: `${pct}%`, backgroundColor: color ?? colors.primary }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { height: 9, borderRadius: 9, overflow: "hidden" },
  fill: { height: 9, borderRadius: 9 },
});
