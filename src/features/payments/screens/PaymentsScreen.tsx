import { router } from "expo-router";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { AppButton, Card, Notice, Screen, SegmentedControl } from "@/components/ui";
import { money, type Contribution, type Payout } from "@/core/engine";
import { useTranslation } from "@/core/i18n";
import { showToast } from "@/core/feedback";
import { memberName, useEqubStore } from "@/store";
import { useFeedbackStore } from "@/store/useFeedbackStore";
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

  const verify = async (payment: Contribution, confirmed: boolean) => {
    const approved = await useFeedbackStore.getState().requestConfirmation({
      title: confirmed ? "Verify payment" : "Reject payment",
      message: confirmed ? t.confirmPayment : t.rejectPaymentQuestion,
      confirmLabel: confirmed ? t.yes : t.reject,
      cancelLabel: t.cancel,
      danger: !confirmed,
      icon: confirmed ? "checkmark-circle-outline" : "close-circle-outline",
    });
    if (!approved) return;
    try {
      await verifyPayment(payment.id, confirmed);
      showToast("success", confirmed ? t.paymentVerified : t.paymentRejected);
    } catch (error) {
      showToast("error", t.actionFailed, error instanceof Error ? error.message : "Unknown error");
    }
  };

  const approve = async (payout: Payout) => {
    const approved = await useFeedbackStore.getState().requestConfirmation({
      title: t.approve,
      message: `Approve ${money(payout.netAmount)} for ${memberName(data, payout.recipientMemberId)}?`,
      confirmLabel: t.yes,
      cancelLabel: t.cancel,
      icon: "wallet-outline",
    });
    if (!approved) return;
    try {
      await approvePayoutById(payout.id);
      showToast("success", t.approve);
    } catch (error) {
      showToast("error", t.actionFailed, error instanceof Error ? error.message : "Unknown error");
    }
  };

  const reversed = [...data.contributions].reverse();
  const drawnCycles = [...data.cycles].filter((cycle) => cycle.recipientMemberId).reverse();

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <View style={[styles.titleIcon, { backgroundColor: colors.surfaceAlt }]}>
              <Ionicons name="wallet-outline" size={21} color={colors.primary} />
            </View>
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
  content: { padding: spacing.lg, paddingBottom: 40, gap: spacing.md },
  header: { gap: spacing.md, marginBottom: spacing.sm },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  titleIcon: { width: 42, height: 42, borderRadius: 15, alignItems: "center", justifyContent: "center" },
  pageTitle: { fontSize: 25, fontWeight: "800", flex: 1 },
  addButton: { minWidth: 94 },
  actions: { flexDirection: "row", gap: 9, marginTop: 5 },
  winnerLabel: { fontSize: 10, fontWeight: "800" },
  winnerName: { fontSize: 14, fontWeight: "800", marginTop: 6 },
  winnerMeta: { fontSize: 10, marginTop: 4 },
});
