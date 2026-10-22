import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Pressable,
  Modal,
  Alert,
} from "react-native";
import { Palette, Radii, Shadows, Spacing } from "../theme/theme";
import type { Translations } from "../i18n/translations";
import type { Member } from "../engine/engine";

interface RecordPaymentModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: {
    memberId: string;
    amount: number;
    paymentRail: string;
    reference: string;
    note: string;
  }) => void;
  members: Member[];
  defaultAmount: number;
  t: Translations;
}

export const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({
  visible,
  onClose,
  onSubmit,
  members,
  defaultAmount,
  t,
}) => {
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [amount, setAmount] = useState(String(defaultAmount));
  const [paymentRail, setPaymentRail] = useState("telebirr");
  const [reference, setReference] = useState("");
  const [note, setNote] = useState("");

  const activeMembers = members.filter((m) => m.status === "active");

  const handleSubmit = () => {
    if (!selectedMemberId) {
      Alert.alert(t.requiredError, t.chooseMemberLabel);
      return;
    }
    const numAmount = Number(amount);
    if (!Number.isFinite(numAmount) || numAmount <= 0) {
      Alert.alert(t.invalidAmountError);
      return;
    }

    const fullNote = [
      paymentRail.toUpperCase(),
      reference.trim() ? `Ref: ${reference.trim()}` : null,
      note.trim() || null,
    ]
      .filter(Boolean)
      .join(" • ");

    onSubmit({
      memberId: selectedMemberId,
      amount: numAmount,
      paymentRail,
      reference: reference.trim(),
      note: fullNote,
    });

    // reset
    setSelectedMemberId("");
    setReference("");
    setNote("");
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.backdrop}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>{t.recordPaymentBtn}</Text>
              <Text style={styles.modalSubtitle}>የክፍያ መዝገብና ደረሰኝ ማስገቢያ</Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </Pressable>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* Member Picker */}
            <Text style={styles.fieldLabel}>{t.chooseMemberLabel} *</Text>
            <View style={styles.memberPickerCard}>
              <ScrollView style={{ maxHeight: 150 }} nestedScrollEnabled>
                {activeMembers.map((m) => {
                  const isSelected = selectedMemberId === m.id;
                  return (
                    <Pressable
                      key={m.id}
                      onPress={() => setSelectedMemberId(m.id)}
                      style={[
                        styles.memberOption,
                        isSelected && styles.memberOptionSelected,
                      ]}
                    >
                      <View style={styles.memberAvatar}>
                        <Text style={styles.memberAvatarText}>
                          {m.name.slice(0, 1)}
                        </Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={[
                            styles.memberName,
                            isSelected && styles.memberNameSelected,
                          ]}
                        >
                          {m.name}
                        </Text>
                        <Text style={styles.memberPhone}>{m.phone}</Text>
                      </View>
                      {isSelected && (
                        <Text style={styles.checkIcon}>✓</Text>
                      )}
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>

            {/* Amount */}
            <Text style={styles.fieldLabel}>{t.amountLabel} *</Text>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholder={String(defaultAmount)}
              placeholderTextColor={Palette.textMuted}
              style={styles.input}
            />

            {/* Payment Rail Selector */}
            <Text style={styles.fieldLabel}>{t.paymentRailLabel}</Text>
            <View style={styles.railGrid}>
              {[
                { id: "telebirr", label: t.railTelebirr },
                { id: "cbe", label: t.railCBE },
                { id: "bank", label: t.railBankTransfer },
                { id: "cash", label: t.railCash },
              ].map((rail) => {
                const isSelected = paymentRail === rail.id;
                return (
                  <Pressable
                    key={rail.id}
                    onPress={() => setPaymentRail(rail.id)}
                    style={[
                      styles.railChip,
                      isSelected && styles.railChipSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.railText,
                        isSelected && styles.railTextSelected,
                      ]}
                    >
                      {rail.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Reference */}
            <Text style={styles.fieldLabel}>{t.referenceLabel}</Text>
            <TextInput
              value={reference}
              onChangeText={setReference}
              placeholder={t.referencePlaceholder}
              placeholderTextColor={Palette.textMuted}
              style={styles.input}
            />

            {/* Note */}
            <Text style={styles.fieldLabel}>ተጨማሪ ማስታወሻ (አማራጭ)</Text>
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder="ስለ ክፍያው ተጨማሪ ማብራሪያ..."
              placeholderTextColor={Palette.textMuted}
              style={styles.input}
            />

            {/* Notice */}
            <View style={styles.pendingNoticeCard}>
              <Text style={styles.pendingNoticeText}>
                {t.paymentPendingNotice}
              </Text>
            </View>
          </ScrollView>

          {/* Action Row */}
          <View style={styles.actionsRow}>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [styles.cancelBtn, pressed && styles.btnPressed]}
            >
              <Text style={styles.cancelBtnText}>{t.cancel}</Text>
            </Pressable>

            <Pressable
              onPress={handleSubmit}
              style={({ pressed }) => [styles.submitBtn, pressed && styles.btnPressed]}
            >
              <Text style={styles.submitBtnText}>{t.recordPaymentBtn}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 29, 45, 0.72)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: Palette.surfaceWhite,
    borderTopLeftRadius: Radii.xl,
    borderTopRightRadius: Radii.xl,
    maxHeight: "90%",
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxl,
    paddingHorizontal: Spacing.lg,
    ...Shadows.floating,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.sm,
  },
  modalTitle: {
    color: Palette.midnightNavy,
    fontSize: 18,
    fontWeight: "800",
  },
  modalSubtitle: {
    color: Palette.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: Radii.full,
    backgroundColor: Palette.neutralSurface,
    alignItems: "center",
    justifyContent: "center",
  },
  closeBtnText: {
    color: Palette.textMuted,
    fontSize: 14,
    fontWeight: "700",
  },
  body: {
    marginVertical: Spacing.sm,
  },
  fieldLabel: {
    color: Palette.midnightNavy,
    fontSize: 12,
    fontWeight: "700",
    marginTop: Spacing.sm,
    marginBottom: 4,
  },
  memberPickerCard: {
    backgroundColor: Palette.neutralSurface,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: Palette.neutralBorder,
    overflow: "hidden",
  },
  memberOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: Palette.neutralBorder,
    gap: Spacing.sm,
  },
  memberOptionSelected: {
    backgroundColor: Palette.royalBlueLight,
  },
  memberAvatar: {
    width: 28,
    height: 28,
    borderRadius: Radii.sm,
    backgroundColor: Palette.surfaceWhite,
    alignItems: "center",
    justifyContent: "center",
  },
  memberAvatarText: {
    color: Palette.midnightNavy,
    fontSize: 13,
    fontWeight: "700",
  },
  memberName: {
    color: Palette.midnightNavy,
    fontSize: 12.5,
    fontWeight: "600",
  },
  memberNameSelected: {
    color: Palette.royalBlue,
    fontWeight: "800",
  },
  memberPhone: {
    color: Palette.textMuted,
    fontSize: 10,
  },
  checkIcon: {
    color: Palette.royalBlue,
    fontSize: 14,
    fontWeight: "900",
  },
  input: {
    backgroundColor: Palette.neutralSurface,
    borderWidth: 1,
    borderColor: Palette.neutralBorder,
    borderRadius: Radii.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 9,
    fontSize: 13,
    color: Palette.midnightNavy,
  },
  railGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.xs + 2,
  },
  railChip: {
    backgroundColor: Palette.neutralSurface,
    borderRadius: Radii.sm,
    borderWidth: 1,
    borderColor: Palette.neutralBorder,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  railChipSelected: {
    backgroundColor: Palette.royalBlue,
    borderColor: Palette.royalBlue,
  },
  railText: {
    color: Palette.textSecondary,
    fontSize: 11,
    fontWeight: "600",
  },
  railTextSelected: {
    color: Palette.surfaceWhite,
    fontWeight: "800",
  },
  pendingNoticeCard: {
    backgroundColor: Palette.pendingAmberSurface,
    borderRadius: Radii.sm,
    borderWidth: 1,
    borderColor: Palette.pendingAmberBorder,
    padding: Spacing.sm,
    marginTop: Spacing.md,
  },
  pendingNoticeText: {
    color: Palette.pendingAmber,
    fontSize: 10.5,
    lineHeight: 15,
  },
  actionsRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  cancelBtn: {
    backgroundColor: Palette.neutralSurface,
    borderRadius: Radii.md,
    paddingVertical: 12,
    paddingHorizontal: Spacing.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtnText: {
    color: Palette.midnightNavy,
    fontSize: 12.5,
    fontWeight: "700",
  },
  submitBtn: {
    flex: 1,
    backgroundColor: Palette.royalBlue,
    borderRadius: Radii.md,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  submitBtnText: {
    color: Palette.surfaceWhite,
    fontSize: 13,
    fontWeight: "800",
  },
  btnPressed: {
    opacity: 0.85,
  },
});
