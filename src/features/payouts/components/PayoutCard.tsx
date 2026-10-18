import { StyleSheet, Text, View } from "react-native";
import { AppButton, Card, StatusBadge } from "@/components/ui";
import { money, type Payout } from "@/core/engine";
import { useTranslation } from "@/core/i18n";
import { useTheme } from "@/theme";

interface Props {
  payout: Payout;
  cycleLabel: string;
  recipientName: string;
  onApprove?: (payout: Payout) => void;
}

export function PayoutCard({ payout, cycleLabel, recipientName, onApprove }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  return (
    <Card style={styles.card}>
      <Text style={[styles.eyebrow, { color: colors.primary }]}>{cycleLabel}</Text>
      <Text style={[styles.title, { color: colors.text }]}>{recipientName}</Text>
      <Text style={[styles.amount, { color: colors.primary }]}>{money(payout.netAmount)}</Text>
      <Text style={[styles.meta, { color: colors.muted }]}>
        Gross {money(payout.grossAmount)} · Deductions {money(payout.deductions)}
      </Text>
      <View>
        <StatusBadge status={payout.status} />
      </View>
      {payout.status === "pending_approval" && onApprove ? (
        <AppButton label={t.approve} onPress={() => onApprove(payout)} />
      ) : null}
      {payout.evidenceNote ? <Text style={[styles.meta, { color: colors.muted }]}>{payout.evidenceNote}</Text> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: 7 },
  eyebrow: { fontSize: 10, fontWeight: "800", letterSpacing: 1.4 },
  title: { fontWeight: "700", fontSize: 13 },
  amount: { fontSize: 25, fontWeight: "900", marginVertical: 8 },
  meta: { fontSize: 11, marginTop: 4 },
});
