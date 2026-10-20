import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import { Card, Notice, Screen } from "@/components/ui";
import { money, type Payout } from "@/core/engine";
import { useTranslation } from "@/core/i18n";
import { memberName, useEqubStore } from "@/store";
import { spacing, useTheme } from "@/theme";
import { PayoutCard } from "../components/PayoutCard";

export function PayoutsScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const data = useEqubStore((s) => s.data);
  const approvePayoutById = useEqubStore((s) => s.approvePayoutById);
  const drawnCycles = [...data.cycles].filter((cycle) => cycle.recipientMemberId).reverse();

  const approve = (payout: Payout) => {
    Alert.alert("Approve payout", `Approve ${money(payout.netAmount)} for ${memberName(data, payout.recipientMemberId)}?`, [
      { text: t.cancel, style: "cancel" },
      {
        text: t.yes,
        onPress: () => {
          try {
            approvePayoutById(payout.id);
          } catch (error) {
            Alert.alert("Could not complete action", error instanceof Error ? error.message : "Unknown error");
          }
        },
      },
    ]);
  };

  return (
    <Screen>
      <FlatList
        contentContainerStyle={styles.content}
        data={data.payouts}
        keyExtractor={(p) => p.id}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[styles.pageTitle, { color: colors.text }]}>{t.payouts}</Text>
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
  content: { padding: spacing.lg, paddingBottom: 30, gap: spacing.md },
  header: { gap: spacing.md, marginBottom: spacing.sm },
  pageTitle: { fontSize: 22, fontWeight: "900" },
  winnerLabel: { fontSize: 10, fontWeight: "800" },
  winnerName: { fontSize: 14, fontWeight: "800", marginTop: 6 },
  winnerMeta: { fontSize: 10, marginTop: 4 },
});
