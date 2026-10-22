import { Ionicons } from "@expo/vector-icons";
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
      <View style={styles.topRow}>
        <View style={[styles.icon, { backgroundColor: colors.surfaceAlt }]}>
          <Ionicons name="wallet-outline" size={19} color={colors.primary} />
        </View>
        <View style={styles.heading}>
          <Text style={[styles.eyebrow, { color: colors.muted }]}>{cycleLabel}</Text>
          <Text style={[styles.title, { color: colors.text }]}>{recipientName}</Text>
        </View>
        <StatusBadge status={payout.status} />
      </View>
      <Text style={[styles.amount, { color: colors.primary }]}>{money(payout.netAmount)}</Text>
      <Text style={[styles.meta, { color: colors.muted }]}>
        Gross {money(payout.grossAmount)} · Deductions {money(payout.deductions)}
      </Text>
      {payout.status === "pending_approval" && onApprove ? (
        <AppButton label={t.approve} onPress={() => onApprove(payout)} />
      ) : null}
      {payout.evidenceNote ? <Text style={[styles.meta, { color: colors.muted }]}>{payout.evidenceNote}</Text> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: 9 },
  topRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  icon: { width: 40, height: 40, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  heading: { flex: 1, gap: 3 },
  eyebrow: { fontSize: 10, fontWeight: "700" },
  title: { fontWeight: "800", fontSize: 13 },
  amount: { fontSize: 25, fontWeight: "900", marginTop: 4 },
  meta: { fontSize: 11, marginTop: 4 },
});
