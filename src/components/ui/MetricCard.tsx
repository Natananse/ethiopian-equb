import { StyleSheet, Text } from "react-native";
import { useTheme } from "@/theme";
import { Card } from "./Card";

interface Props {
  label: string;
  value: string;
  sub?: string;
  color?: string;
}

export function MetricCard({ label, value, sub, color }: Props) {
  const { colors } = useTheme();
  return (
    <Card style={styles.card}>
      <Text style={[styles.label, { color: colors.muted }]}>{label}</Text>
      <Text style={[styles.value, { color: color ?? colors.text }]}>{value}</Text>
      {sub ? <Text style={[styles.sub, { color: colors.muted }]}>{sub}</Text> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { flexGrow: 1, flexBasis: "46%", minWidth: 135 },
  label: { fontSize: 11, minHeight: 28 },
  value: { fontSize: 18, fontWeight: "800", marginTop: 5 },
  sub: { fontSize: 11, marginTop: 4 },
});
