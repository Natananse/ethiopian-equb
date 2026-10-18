import { StyleSheet, Text, View } from "react-native";
import { Card, StatusBadge } from "@/components/ui";
import { money, type Contribution } from "@/core/engine";
import { useTheme } from "@/theme";

interface Props {
  contribution: Contribution;
  memberName: string;
  children?: React.ReactNode;
}

export function PaymentCard({ contribution, memberName, children }: Props) {
  const { colors } = useTheme();
  return (
    <Card style={styles.card}>
      <View style={styles.titleRow}>
        <Text style={[styles.title, { color: colors.text }]}>{memberName}</Text>
        <StatusBadge status={contribution.status} />
      </View>
      <Text style={[styles.amount, { color: colors.text }]}>{money(contribution.amount)}</Text>
      <Text style={[styles.meta, { color: colors.muted }]}>
        {new Date(contribution.paidAt).toLocaleString()} · {contribution.note ?? "—"}
      </Text>
      {children}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: 7 },
  titleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 10 },
  title: { fontWeight: "700", fontSize: 13, flex: 1 },
  amount: { fontWeight: "800", fontSize: 14 },
  meta: { fontSize: 11, marginTop: 4 },
});
