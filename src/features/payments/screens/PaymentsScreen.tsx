import { router } from "expo-router";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import { AppButton, Notice, Screen } from "@/components/ui";
import type { Contribution } from "@/core/engine";
import { useTranslation } from "@/core/i18n";
import { memberName, useEqubStore } from "@/store";
import { spacing, useTheme } from "@/theme";
import { PaymentCard } from "../components/PaymentCard";

export function PaymentsScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const data = useEqubStore((s) => s.data);
  const verifyPayment = useEqubStore((s) => s.verifyPayment);

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

  const reversed = [...data.contributions].reverse();

  return (
    <Screen>
      <FlatList
        contentContainerStyle={styles.content}
        data={reversed}
        keyExtractor={(p) => p.id}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Text style={[styles.pageTitle, { color: colors.text }]}>{t.payments}</Text>
              <View style={styles.addButton}>
                <AppButton label={`＋ ${t.add}`} onPress={() => router.push("/record-payment")} />
              </View>
            </View>
            <Notice>{t.paymentSaved}</Notice>
          </View>
        }
        ListEmptyComponent={<Text style={{ color: colors.muted, fontSize: 13 }}>{t.noPayments}</Text>}
        renderItem={({ item }) => (
          <PaymentCard
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
        )}
      />
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
});
