import { router } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { AppButton, Card, Notice, Screen, SegmentedControl } from "@/components/ui";
import { money, type Contribution, type Payout } from "@/core/engine";
import { useTranslation } from "@/core/i18n";
import { memberName, useEqubStore } from "@/store";
import { spacing, useTheme } from "@/theme";
import { PaymentCard } from "../components/PaymentCard";
import { PayoutCard } from "@/features/payouts/components/PayoutCard";

type FinanceSection = "payments" | "payouts";

export function PaymentsScreen({ initialSection = "payments" }: { initialSection?: FinanceSection }) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const data = useEqubStore((s) => s.data);
  const verifyPayment = useEqubStore((s) => s.verifyPayment);
  const approvePayoutById = useEqubStore((s) => s.approvePayoutById);
  const [section, setSection] = useState<FinanceSection>(initialSection);

  const verify = (payment: Contribution, confirmed: boolean) => {
    const action = () => {
      try {
        verifyPayment(payment.id, confirmed);
      } catch (error) {
        Alert.alert("Could not complete action", error instanceof Error ? error.message : "Unknown error");
      }
    };
    if (confirmed) {
      Alert.alert("Verify payment", t.confirmPayment, [
        { text: t.no, style: "cancel" },
        { text: t.yes, onPress: action },
      ]);
    } else {
      Alert.alert("Reject payment", "Reject this pending record?", [
        { text: t.cancel, style: "cancel" },
        { text: t.reject, style: "destructive", onPress: action },
      ]);
    }
  };

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

  const reversed = [...data.contributions].reverse();
  const drawnCycles = [...data.cycles].filter((cycle) => cycle.recipientMemberId).reverse();

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text style={[styles.pageTitle, { color: colors.text }]}>{t.finance}</Text>
            {section === "payments" ? (
              <View style={styles.addButton}>
                <AppButton label={t.add} icon="add" onPress={() => router.push("/record-payment")} />
              </View>
            ) : null}
          </View>
          <SegmentedControl<FinanceSection>
            value={section}
            onChange={setSection}
            options={[
              { value: "payments", label: t.payments },
              { value: "payouts", label: t.payouts },
            ]}
          />
        </View>

        {section === "payments" ? (
          <>
            <Notice>{t.paymentSaved}</Notice>
            {reversed.length === 0 ? (
              <Text style={{ color: colors.muted, fontSize: 13 }}>{t.noPayments}</Text>
            ) : (
              reversed.map((item) => (
                <PaymentCard
                  key={item.id}
                  contribution={item}
                  memberName={memberName(data, item.memberId)}
                  cycleLabel={data.cycles.find((cycle) => cycle.id === item.cycleId)?.label ?? item.cycleId}
                >
                  {item.status === "pending" ? (
                    <View style={styles.actions}>
                      <AppButton label={t.verify} onPress={() => verify(item, true)} />
                      <AppButton label={t.reject} onPress={() => verify(item, false)} secondary />
                    </View>
                  ) : null}
                </PaymentCard>
              ))
            )}
          </>
        ) : (
          <>
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
            {data.payouts.length === 0 ? (
              <Text style={{ color: colors.muted, fontSize: 13 }}>{t.noPayouts}</Text>
            ) : (
              data.payouts.map((item) => (
                <PayoutCard
                  key={item.id}
                  payout={item}
                  cycleLabel={data.cycles.find((cycle) => cycle.id === item.cycleId)?.label ?? item.cycleId}
                  recipientName={memberName(data, item.recipientMemberId)}
                  onApprove={approve}
                />
              ))
            )}
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, paddingBottom: 30, gap: spacing.md },
  header: { gap: spacing.md, marginBottom: spacing.sm },
  titleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 10 },
  pageTitle: { fontSize: 22, fontWeight: "900", flex: 1 },
  addButton: { minWidth: 110 },
  actions: { flexDirection: "row", gap: 9, marginTop: 5 },
  winnerLabel: { fontSize: 10, fontWeight: "800" },
  winnerName: { fontSize: 14, fontWeight: "800", marginTop: 6 },
  winnerMeta: { fontSize: 10, marginTop: 4 },
});
