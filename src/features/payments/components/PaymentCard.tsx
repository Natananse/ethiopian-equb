import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card, StatusBadge } from "@/components/ui";
import { money, type Contribution } from "@/core/engine";
import { useTranslation } from "@/core/i18n";
import { useTheme } from "@/theme";

interface Props {
  contribution: Contribution;
  memberName: string;
  cycleLabel: string;
  children?: React.ReactNode;
}

export function PaymentCard({ contribution, memberName, cycleLabel, children }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  return (
    <Card style={styles.card}>
      <View style={styles.titleRow}>
        <Text style={[styles.title, { color: colors.text }]}>{memberName}</Text>
        <StatusBadge status={contribution.status} />
      </View>
      <View style={styles.details}>
        <View style={styles.cycleLine}>
          <Ionicons name="calendar-outline" size={14} color={colors.primary} />
          <Text style={[styles.cycle, { color: colors.primary }]}>{t.cycle}: {cycleLabel}</Text>
        </View>
        <Text style={[styles.amount, { color: colors.text }]}>{money(contribution.amount)}</Text>
      </View>
      <Text style={[styles.meta, { color: colors.muted }]}>
        {new Date(contribution.paidAt).toLocaleDateString()} · {contribution.note ?? "—"}
      </Text>
      {children}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: 9 },
  titleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 10 },
  title: { fontWeight: "800", fontSize: 14, flex: 1 },
  details: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  cycleLine: { flexDirection: "row", alignItems: "center", gap: 5 },
  cycle: { fontSize: 11, fontWeight: "700" },
  amount: { fontWeight: "800", fontSize: 17 },
  meta: { fontSize: 11, marginTop: 4 },
});
