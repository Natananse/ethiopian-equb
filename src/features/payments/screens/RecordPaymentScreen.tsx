import { router } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { AppButton, AppTextInput } from "@/components/ui";
import { useTranslation } from "@/core/i18n";
import { selectActiveCycle, useEqubStore } from "@/store";
import { radius, spacing, useTheme } from "@/theme";

/** Modal route: /record-payment */
export function RecordPaymentScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const data = useEqubStore((s) => s.data);
  const recordPayment = useEqubStore((s) => s.recordPayment);

  const cycleId = selectActiveCycle(data)?.id ?? "";
  const [selectedMember, setSelectedMember] = useState("");
  const [amount, setAmount] = useState(String(data.contributionAmount));
  const [note, setNote] = useState("");

  const submit = () => {
    if (!cycleId || !selectedMember) {
      Alert.alert("Choose a member", t.selectMember);
      return;
    }
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) {
      Alert.alert("Invalid amount", "Enter an amount greater than zero.");
      return;
    }
    try {
      recordPayment({ memberId: selectedMember, cycleId, amount: value, note });
    } catch (error) {
      Alert.alert("Could not complete action", error instanceof Error ? error.message : "Unknown error");
      return;
    }
    Alert.alert("Submitted", t.paymentSaved, [{ text: "OK", onPress: () => router.back() }]);
  };

  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={styles.content}>
      <Text style={[styles.title, { color: colors.text }]}>{t.recordPayment}</Text>
      <Text style={[styles.label, { color: colors.muted }]}>{t.selectMember}</Text>
      <View>
        {data.members
          .filter((m) => m.status === "active")
          .map((m) => (
            <Pressable
              key={m.id}
              onPress={() => setSelectedMember(m.id)}
              style={[
                styles.option,
                { borderBottomColor: colors.border },
                selectedMember === m.id && { backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.primary },
              ]}
            >
              <Text style={[styles.optionTitle, { color: colors.text }]}>{m.name}</Text>
              <Text style={[styles.optionMeta, { color: colors.muted }]}>{m.phone}</Text>
            </Pressable>
          ))}
      </View>
      <Text style={[styles.label, { color: colors.muted }]}>{t.contribution}</Text>
      <AppTextInput value={amount} onChangeText={setAmount} keyboardType="numeric" />
      <AppTextInput value={note} onChangeText={setNote} placeholder="Reference / note (optional)" />
      <View style={styles.actions}>
        <AppButton label={t.cancel} onPress={() => router.back()} secondary />
        <AppButton label={t.submitPayment} onPress={submit} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.sm },
  title: { fontSize: 19, fontWeight: "900", marginBottom: 6 },
  label: { fontSize: 12, fontWeight: "700", marginTop: 9 },
  option: { padding: 10, borderBottomWidth: 1, borderRadius: radius.sm },
  optionTitle: { fontWeight: "700", fontSize: 13 },
  optionMeta: { fontSize: 11, marginTop: 4 },
  actions: { flexDirection: "row", gap: 9, marginTop: 12 },
});
