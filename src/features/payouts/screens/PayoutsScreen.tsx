import { FlatList, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card, Notice, Screen } from "@/components/ui";
import { money, type Payout } from "@/core/engine";
import { useTranslation } from "@/core/i18n";
import { showToast } from "@/core/feedback";
import { memberName, useEqubStore } from "@/store";
import { useFeedbackStore } from "@/store/useFeedbackStore";
import { spacing, useTheme } from "@/theme";
import { PayoutCard } from "../components/PayoutCard";

export function PayoutsScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const data = useEqubStore((s) => s.data);
  const approvePayoutById = useEqubStore((s) => s.approvePayoutById);
  const drawnCycles = [...data.cycles].filter((cycle) => cycle.recipientMemberId).reverse();

  const approve = async (payout: Payout) => {
    const confirmed = await useFeedbackStore.getState().requestConfirmation({
      title: t.approve,
      message: `Approve ${money(payout.netAmount)} for ${memberName(data, payout.recipientMemberId)}?`,
      confirmLabel: t.yes,
      cancelLabel: t.cancel,
      icon: "wallet-outline",
    });
    if (!confirmed) return;
    try {
      await approvePayoutById(payout.id);
      showToast("success", t.approve);
    } catch (error) {
      showToast("error", t.actionFailed, error instanceof Error ? error.message : "Unknown error");
    }
  };

  return (
    <Screen>
      <FlatList
        contentContainerStyle={styles.content}
        data={data.payouts}
        keyExtractor={(p) => p.id}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <View style={[styles.titleIcon, { backgroundColor: colors.surfaceAlt }]}>
                <Ionicons name="wallet-outline" size={21} color={colors.primary} />
              </View>
              <Text style={[styles.pageTitle, { color: colors.text }]}>{t.payouts}</Text>
            </View>
            <Notice>{t.payoutWarning}</Notice>
            {drawnCycles.map((cycle) => {
              const winner = data.members.find((member) => member.id === cycle.recipientMemberId);
              return (
                <Card key={cycle.id}>
                  <Text style={[styles.winnerLabel, { color: colors.primary }]}>{t.cycle}: {cycle.label} · {t.drawnWinner}</Text>
                  <Text style={[styles.winnerName, { color: colors.text }]}>{winner?.name ?? t.noIdentity}</Text>
                  <Text style={[styles.winnerMeta, { color: colors.muted }]}>
                    {t.customerNumber}: {winner?.customerNumber ?? t.noIdentity} · {t.idNumber}: {winner?.idNumber ?? t.noIdentity}
                  </Text>
                  <Text style={[styles.winnerMeta, { color: colors.muted }]}>{t.drawNoTransfer}</Text>
                </Card>
              );
            })}
          </View>
        }
        ListEmptyComponent={<Text style={{ color: colors.muted, fontSize: 13 }}>{t.noPayouts}</Text>}
        renderItem={({ item }) => (
          <PayoutCard
            payout={item}
            cycleLabel={data.cycles.find((c) => c.id === item.cycleId)?.label ?? item.cycleId}
            recipientName={memberName(data, item.recipientMemberId)}
            onApprove={approve}
          />
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, paddingBottom: 40, gap: spacing.md },
  header: { gap: spacing.md, marginBottom: spacing.sm },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  titleIcon: { width: 42, height: 42, borderRadius: 15, alignItems: "center", justifyContent: "center" },
  pageTitle: { fontSize: 25, fontWeight: "800" },
  winnerLabel: { fontSize: 10, fontWeight: "800" },
  winnerName: { fontSize: 14, fontWeight: "800", marginTop: 6 },
  winnerMeta: { fontSize: 10, marginTop: 4 },
});
