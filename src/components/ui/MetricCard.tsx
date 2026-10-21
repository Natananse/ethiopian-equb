import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { StyleSheet, Text } from "react-native";
import { useTheme } from "@/theme";
import { Card } from "./Card";

interface Props {
  label: string;
  value: string;
  sub?: string;
  color?: string;
  icon?: ComponentProps<typeof Ionicons>["name"];
}

export function MetricCard({ label, value, sub, color, icon }: Props) {
  const { colors } = useTheme();
  return (
    <Card style={styles.card}>
      {icon ? <Ionicons name={icon} size={19} color={color ?? colors.primary} /> : null}
      <Text style={[styles.label, { color: colors.muted }]}>{label}</Text>
      <Text style={[styles.value, { color: color ?? colors.text }]}>{value}</Text>
      {sub ? <Text style={[styles.sub, { color: colors.muted }]}>{sub}</Text> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { flexGrow: 1, flexBasis: "46%", minWidth: 145, gap: 5 },
  label: { fontSize: 11, minHeight: 28, fontWeight: "600" },
  value: { fontSize: 19, fontWeight: "800", marginTop: 1 },
  sub: { fontSize: 11, marginTop: 4 },
});
