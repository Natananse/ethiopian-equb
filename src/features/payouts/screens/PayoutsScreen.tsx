import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import { Notice, Screen } from "@/components/ui";
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
});
