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
import { money } from "../engine/engine";

interface CreateEqubModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: {
    groupName: string;
    contributionAmount: number;
    maxMembers: number;
    frequency: "monthly";
    payoutMethod: string;
    description: string;
  }) => void;
  t: Translations;
}

export const CreateEqubModal: React.FC<CreateEqubModalProps> = ({
  visible,
  onClose,
  onSubmit,
  t,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("5000");
  const [capacity, setCapacity] = useState("40");
  const [payoutMethod, setPayoutMethod] = useState("lottery");
  const [lateFee, setLateFee] = useState("250");

  const numAmount = Math.max(100, Number(amount) || 5000);
  const numCapacity = Math.max(2, Number(capacity) || 40);
  const totalPool = numAmount * numCapacity;

  const handleNext = () => {
    if (step === 1) {
      if (!groupName.trim()) {
        Alert.alert(t.requiredError, "እባክዎ የዕቁቡን ስም ያስገቡ።");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (numAmount <= 0) {
        Alert.alert(t.invalidAmountError);
        return;
      }
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    } else if (step === 4) {
      onSubmit({
        groupName: groupName.trim(),
        contributionAmount: numAmount,
        maxMembers: numCapacity,
        frequency: "monthly",
        payoutMethod,
        description: description.trim(),
      });
      // reset
      setStep(1);
      setGroupName("");
      setDescription("");
      onClose();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((step - 1) as 1 | 2 | 3);
    } else {
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.backdrop}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>{t.createTitle}</Text>
              <Text style={styles.stepSubtitle}>
                ደረጃ {step} ከ 4 •{" "}
                {step === 1
                  ? t.stepBasic
                  : step === 2
                  ? t.stepFinancials
                  : step === 3
                  ? t.stepRules
                  : t.stepPreview}
              </Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </Pressable>
          </View>

          {/* Step Progress Bar */}
          <View style={styles.stepTrack}>
            <View style={[styles.stepFill, { width: `${(step / 4) * 100}%` }]} />
          </View>

          <ScrollView style={styles.formBody}>
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <View style={styles.stepContent}>
                <Text style={styles.fieldLabel}>{t.groupNameLabel} *</Text>
                <TextInput
                  value={groupName}
                  onChangeText={setGroupName}
                  placeholder={t.groupNamePlaceholder}
                  placeholderTextColor={Palette.textMuted}
                  style={styles.input}
                />

                <Text style={styles.fieldLabel}>{t.descriptionLabel}</Text>
                <TextInput
                  value={description}
                  onChangeText={setDescription}
                  placeholder={t.descriptionPlaceholder}
                  placeholderTextColor={Palette.textMuted}
                  style={[styles.input, styles.multilineInput]}
                  multiline
                  numberOfLines={3}
                />
              </View>
            )}

            {/* Step 2: Financial Settings */}
            {step === 2 && (
              <View style={styles.stepContent}>
                <Text style={styles.fieldLabel}>{t.contributionAmountLabel} *</Text>
                <TextInput
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="5000"
                  keyboardType="numeric"
                  placeholderTextColor={Palette.textMuted}
                  style={styles.input}
                />

                <Text style={styles.fieldLabel}>{t.capacityLabel} (አባላት)</Text>
                <TextInput
                  value={capacity}
                  onChangeText={setCapacity}
                  placeholder="40"
                  keyboardType="numeric"
                  placeholderTextColor={Palette.textMuted}
                  style={styles.input}
                />

                <View style={styles.poolPreviewCard}>
                  <Text style={styles.poolPreviewLabel}>በየወሩ የሚሰበሰብ ጠቅላላ ገቢ</Text>
                  <Text style={styles.poolPreviewValue}>{money(totalPool)}</Text>
                  <Text style={styles.poolPreviewSub}>
                    {numCapacity} አባላት × {money(numAmount)} = {money(totalPool)}
                  </Text>
                </View>
              </View>
            )}

            {/* Step 3: Rules & Governance */}
            {step === 3 && (
              <View style={styles.stepContent}>
                <Text style={styles.fieldLabel}>{t.payoutMethodLabel}</Text>
                {[
                  { id: "lottery", label: t.methodLottery, sub: "በየወሩ በፍትሃዊ ዕጣ የሚለይ" },
                  { id: "predetermined", label: t.methodPredetermined, sub: "በአባላት የፍላጎት ቅደም-ተከተል" },
                  { id: "rotation", label: t.methodRotation, sub: "በቋሚ የተራ ዙር የሚተላለፍ" },
                ].map((item) => (
                  <Pressable
                    key={item.id}
                    onPress={() => setPayoutMethod(item.id)}
                    style={[
                      styles.radioRow,
                      payoutMethod === item.id && styles.radioRowActive,
                    ]}
                  >
                    <View style={styles.radioCircle}>
                      {payoutMethod === item.id && <View style={styles.radioDot} />}
                    </View>
                    <View style={styles.radioTextWrap}>
                      <Text style={styles.radioTitle}>{item.label}</Text>
                      <Text style={styles.radioSub}>{item.sub}</Text>
                    </View>
                  </Pressable>
                ))}

                <Text style={[styles.fieldLabel, { marginTop: Spacing.md }]}>
                  {t.lateFeeLabel} (ቋሚ የቅጣት መጠን ብር)
                </Text>
                <TextInput
                  value={lateFee}
                  onChangeText={setLateFee}
                  placeholder="250"
                  keyboardType="numeric"
                  placeholderTextColor={Palette.textMuted}
                  style={styles.input}
                />
                <Text style={styles.helpText}>{t.lateFeeDesc}</Text>
              </View>
            )}

            {/* Step 4: Preview Summary */}
            {step === 4 && (
              <View style={styles.stepContent}>
                <View style={styles.previewSummaryCard}>
                  <Text style={styles.previewGroupName}>{groupName}</Text>
                  {description ? (
                    <Text style={styles.previewDescription}>{description}</Text>
                  ) : null}

                  <View style={styles.previewDivider} />

                  <View style={styles.previewRow}>
                    <Text style={styles.previewItemLabel}>ወርሃዊ ክፍያ፦</Text>
                    <Text style={styles.previewItemValue}>{money(numAmount)}</Text>
                  </View>

                  <View style={styles.previewRow}>
                    <Text style={styles.previewItemLabel}>የአባላት ብዛት፦</Text>
                    <Text style={styles.previewItemValue}>{numCapacity} አባላት</Text>
                  </View>

                  <View style={styles.previewRow}>
                    <Text style={styles.previewItemLabel}>የክፍያ ድግግሞሽ፦</Text>
                    <Text style={styles.previewItemValue}>በየወሩ (Monthly)</Text>
                  </View>

                  <View style={styles.previewRow}>
                    <Text style={styles.previewItemLabel}>የምደባ ዘዴ፦</Text>
                    <Text style={styles.previewItemValue}>
                      {payoutMethod === "lottery"
                        ? t.methodLottery
                        : payoutMethod === "predetermined"
                        ? t.methodPredetermined
                        : t.methodRotation}
                    </Text>
                  </View>

                  <View style={styles.poolHeroBox}>
                    <Text style={styles.poolHeroLabel}>{t.totalPoolSummary}</Text>
                    <Text style={styles.poolHeroValue}>{money(totalPool)}</Text>
                  </View>
                </View>

                <View style={styles.securityNoticeBox}>
                  <Text style={styles.securityNoticeText}>
                    ✓ ዕቁቡ ከተቋቋመ በኋላ ህግጋቱ ግልጽ ሆነው ለሁሉም አባላት ይታያሉ።
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.actionsRow}>
            <Pressable
              onPress={handleBack}
              style={({ pressed }) => [styles.backBtn, pressed && styles.btnPressed]}
            >
              <Text style={styles.backBtnText}>
                {step === 1 ? t.cancel : t.back}
              </Text>
            </Pressable>

            <Pressable
              onPress={handleNext}
              style={({ pressed }) => [styles.nextBtn, pressed && styles.btnPressed]}
            >
              <Text style={styles.nextBtnText}>
                {step === 4 ? t.createSubmit : t.next}
              </Text>
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
    backgroundColor: "rgba(15, 29, 45, 0.7)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: Palette.surfaceWhite,
    borderTopLeftRadius: Radii.xl,
    borderTopRightRadius: Radii.xl,
    maxHeight: "88%",
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
  stepSubtitle: {
    color: Palette.royalBlue,
    fontSize: 11,
    fontWeight: "700",
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
  stepTrack: {
    height: 4,
    backgroundColor: Palette.neutralSurface,
    borderRadius: Radii.full,
    overflow: "hidden",
    marginVertical: Spacing.sm,
  },
  stepFill: {
    height: 4,
    backgroundColor: Palette.royalBlue,
  },
  formBody: {
    marginVertical: Spacing.sm,
  },
  stepContent: {
    gap: Spacing.sm,
  },
  fieldLabel: {
    color: Palette.midnightNavy,
    fontSize: 12,
    fontWeight: "700",
    marginTop: Spacing.xs,
  },
  input: {
    backgroundColor: Palette.neutralSurface,
    borderWidth: 1,
    borderColor: Palette.neutralBorder,
    borderRadius: Radii.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    fontSize: 13,
    color: Palette.midnightNavy,
  },
  multilineInput: {
    minHeight: 64,
    textAlignVertical: "top",
  },
  helpText: {
    color: Palette.textMuted,
    fontSize: 10.5,
  },
  poolPreviewCard: {
    backgroundColor: Palette.royalBlueLight,
    borderWidth: 1,
    borderColor: "#C7DBFA",
    borderRadius: Radii.md,
    padding: Spacing.md,
    alignItems: "center",
    marginTop: Spacing.sm,
  },
  poolPreviewLabel: {
    color: Palette.royalBlue,
    fontSize: 11,
    fontWeight: "700",
  },
  poolPreviewValue: {
    color: Palette.midnightNavy,
    fontSize: 22,
    fontWeight: "900",
    marginVertical: 4,
  },
  poolPreviewSub: {
    color: Palette.textSecondary,
    fontSize: 11,
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Palette.neutralSurface,
    borderWidth: 1,
    borderColor: Palette.neutralBorder,
    borderRadius: Radii.md,
    padding: Spacing.md,
    gap: Spacing.md,
    marginBottom: Spacing.xs,
  },
  radioRowActive: {
    backgroundColor: Palette.royalBlueLight,
    borderColor: Palette.royalBlue,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Palette.royalBlue,
    alignItems: "center",
    justifyContent: "center",
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Palette.royalBlue,
  },
  radioTextWrap: {
    flex: 1,
  },
  radioTitle: {
    color: Palette.midnightNavy,
    fontSize: 13,
    fontWeight: "700",
  },
  radioSub: {
    color: Palette.textMuted,
    fontSize: 10.5,
    marginTop: 1,
  },
  previewSummaryCard: {
    backgroundColor: Palette.neutralSurface,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Palette.neutralBorder,
    padding: Spacing.lg,
  },
  previewGroupName: {
    color: Palette.midnightNavy,
    fontSize: 17,
    fontWeight: "800",
  },
  previewDescription: {
    color: Palette.textSecondary,
    fontSize: 11.5,
    marginTop: 4,
  },
  previewDivider: {
    height: 1,
    backgroundColor: Palette.neutralBorder,
    marginVertical: Spacing.md,
  },
  previewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
  },
  previewItemLabel: {
    color: Palette.textSecondary,
    fontSize: 11.5,
    fontWeight: "500",
  },
  previewItemValue: {
    color: Palette.midnightNavy,
    fontSize: 12,
    fontWeight: "700",
  },
  poolHeroBox: {
    backgroundColor: Palette.surfaceWhite,
    borderRadius: Radii.md,
    padding: Spacing.md,
    alignItems: "center",
    marginTop: Spacing.md,
    borderWidth: 1,
    borderColor: Palette.wovenGold,
  },
  poolHeroLabel: {
    color: Palette.wovenGoldDark,
    fontSize: 11,
    fontWeight: "700",
  },
  poolHeroValue: {
    color: Palette.midnightNavy,
    fontSize: 24,
    fontWeight: "900",
    marginTop: 2,
  },
  securityNoticeBox: {
    backgroundColor: Palette.confirmedGreenSurface,
    borderRadius: Radii.sm,
    padding: Spacing.sm,
    marginTop: Spacing.sm,
  },
  securityNoticeText: {
    color: Palette.confirmedGreen,
    fontSize: 11,
    fontWeight: "600",
  },
  actionsRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  backBtn: {
    backgroundColor: Palette.neutralSurface,
    borderRadius: Radii.md,
    paddingVertical: 12,
    paddingHorizontal: Spacing.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  backBtnText: {
    color: Palette.midnightNavy,
    fontSize: 12.5,
    fontWeight: "700",
  },
  nextBtn: {
    flex: 1,
    backgroundColor: Palette.royalBlue,
    borderRadius: Radii.md,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  nextBtnText: {
    color: Palette.surfaceWhite,
    fontSize: 13,
    fontWeight: "800",
  },
  btnPressed: {
    opacity: 0.85,
  },
});
