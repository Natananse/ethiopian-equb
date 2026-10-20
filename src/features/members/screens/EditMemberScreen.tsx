import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { AppButton, AppTextInput } from "@/components/ui";
import { useTranslation } from "@/core/i18n";
import { useEqubStore } from "@/store";
import { spacing, useTheme } from "@/theme";

export function EditMemberScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { memberId } = useLocalSearchParams<{ memberId: string }>();
  const member = useEqubStore((state) => state.data.members.find((item) => item.id === memberId));
  const updateMember = useEqubStore((state) => state.updateMember);
  const [name, setName] = useState(member?.name ?? "");
  const [customerNumber, setCustomerNumber] = useState(member?.customerNumber ?? "");
  const [idNumber, setIdNumber] = useState(member?.idNumber ?? "");
  const [phone, setPhone] = useState(member?.phone ?? "");

  const save = () => {
    if (!member) return;
    if (!name.trim() || !customerNumber.trim() || !idNumber.trim()) {
      Alert.alert("Required", t.required);
      return;
    }
    try {
      updateMember(member.id, { name, customerNumber, idNumber, phone });
    } catch (error) {
      Alert.alert("Could not update member", error instanceof Error ? error.message : "Unknown error");
      return;
    }
    Alert.alert("Saved", t.memberAdded, [{ text: "OK", onPress: () => router.back() }]);
  };

  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={styles.content}>
      <Text style={[styles.title, { color: colors.text }]}>{t.editMember}</Text>
      {member ? (
        <>
          <AppTextInput value={name} onChangeText={setName} placeholder={t.name} />
          <AppTextInput value={customerNumber} onChangeText={setCustomerNumber} placeholder={t.customerNumber} />
          <AppTextInput value={idNumber} onChangeText={setIdNumber} placeholder={t.idNumber} />
          <AppTextInput value={phone} onChangeText={setPhone} placeholder={t.phoneOptional} keyboardType="phone-pad" />
          <View style={styles.actions}>
            <AppButton label={t.cancel} onPress={() => router.back()} secondary />
            <AppButton label={t.save} onPress={save} />
          </View>
        </>
      ) : (
        <>
          <Text style={{ color: colors.muted }}>{t.noMembers}</Text>
          <AppButton label={t.cancel} onPress={() => router.back()} secondary />
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.sm },
  title: { fontSize: 19, fontWeight: "900", marginBottom: 6 },
  actions: { flexDirection: "row", gap: 9, marginTop: 12 },
});
