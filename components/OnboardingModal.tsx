import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  ImageBackground,
  ScrollView,
} from "react-native";
import { Palette, Radii, Shadows, Spacing } from "../theme/theme";
import type { Language, Translations } from "../i18n/translations";

interface OnboardingModalProps {
  visible: boolean;
  onClose: () => void;
  lang: Language;
  onSelectLang: (l: Language) => void;
  t: Translations;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  visible,
  onClose,
  lang,
  onSelectLang,
  t,
}) => {
  const [stepIndex, setStepIndex] = useState(0);

  const steps = [
    {
      step: 1,
      title: "1. የታመነ የዕቁብ ክበብ ይፍጠሩ ወይም ይቀላቀሉ",
      titleEn: "1. Create or Join a Trusted Savings Circle",
      desc: "ከቤተሰብ፣ ከሰፈር ወይም ከስራ ባልደረቦችዎ ጋር የተመሰረተ ህጋዊና ግልጽ የቁጠባ ቡድን ይመስርቱ።",
      descEn: "Form a transparent group with family, neighbors, or colleagues based on mutual trust.",
    },
    {
      step: 2,
      title: "2. በስምምነቱ መሰረት በየወሩ ያዋጡ",
      titleEn: "2. Contribute on the Agreed Schedule",
      desc: "ክፍያዎን በቴሌብር፣ በሲቢኢ ብር ወይም በባንክ ፈጽመው ደረሰኝ ያስመዝግቡ። በገንዘብ ያዡ ይረጋገጣል።",
      descEn: "Submit your payment reference via Telebirr or bank transfer. Verified by your treasurer.",
    },
    {
      step: 3,
      title: "3. የዕጣ ተራዎን ይከታተሉ፣ ምደባዎን ይረከቡ",
      titleEn: "3. Track Payout Rotation and Receive Your Pool",
      desc: "በየወሩ ሙሉው የተሰበሰበ ገቢ ለተራው አባል በግልጽ ይተላለፋል። እያንዳንዱ ሂደት ለሁሉም ይታያል።",
      descEn: "Each month the full collected pool is disbursed to the scheduled recipient transparently.",
    },
  ];

  const current = steps[stepIndex];

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.backdrop}>
        <View style={styles.modalCard}>
          {/* Hero Image Section */}
          <View style={styles.imageContainer}>
            <ImageBackground
              source={require("../assets/equb-gathering.jpg")}
              style={styles.imageBackground}
              imageStyle={styles.imageStyle}
            >
              <View style={styles.imageOverlay}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>የኢትዮጵያ ባህላዊ ዕቁብ</Text>
                </View>
                <Text style={styles.heroTitle}>ዲጂታል ዕቁብ (Digital Equb)</Text>
              </View>
            </ImageBackground>
          </View>

          {/* Language Switch Row */}
          <View style={styles.langRow}>
            <Text style={styles.langLabel}>ቋንቋ ይምረጡ / Choose Language:</Text>
            <View style={styles.langPills}>
              <Pressable
                onPress={() => onSelectLang("am")}
                style={[styles.langPill, lang === "am" && styles.langPillActive]}
              >
                <Text
                  style={[
                    styles.langPillText,
                    lang === "am" && styles.langPillTextActive,
                  ]}
                >
                  አማርኛ
                </Text>
              </Pressable>
              <Pressable
                onPress={() => onSelectLang("en")}
                style={[styles.langPill, lang === "en" && styles.langPillActive]}
              >
                <Text
                  style={[
                    styles.langPillText,
                    lang === "en" && styles.langPillTextActive,
                  ]}
                >
                  English
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Walkthrough Content */}
          <View style={styles.contentBody}>
            <View style={styles.stepIndicator}>
              {steps.map((s, idx) => (
                <View
                  key={s.step}
                  style={[
                    styles.dot,
                    idx === stepIndex && styles.dotActive,
                  ]}
                />
              ))}
            </View>

            <Text style={styles.stepTitle}>
              {lang === "am" ? current.title : current.titleEn}
            </Text>
            <Text style={styles.stepDesc}>
              {lang === "am" ? current.desc : current.descEn}
            </Text>
          </View>

          {/* Action Row */}
          <View style={styles.actionRow}>
            {stepIndex < steps.length - 1 ? (
              <Pressable
                onPress={() => setStepIndex(stepIndex + 1)}
                style={({ pressed }) => [styles.primaryBtn, pressed && styles.btnPressed]}
              >
                <Text style={styles.primaryBtnText}>{t.next} →</Text>
              </Pressable>
            ) : (
              <Pressable
                onPress={onClose}
                style={({ pressed }) => [styles.primaryBtn, pressed && styles.btnPressed]}
              >
                <Text style={styles.primaryBtnText}>ወደ መተግበሪያው ግባ • Start</Text>
              </Pressable>
            )}

            {stepIndex > 0 && (
              <Pressable
                onPress={() => setStepIndex(stepIndex - 1)}
                style={styles.backBtn}
              >
                <Text style={styles.backBtnText}>← {t.back}</Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 29, 45, 0.8)",
    justifyContent: "center",
    padding: Spacing.lg,
  },
  modalCard: {
    backgroundColor: Palette.surfaceWhite,
    borderRadius: Radii.xl,
    overflow: "hidden",
    ...Shadows.floating,
  },
  imageContainer: {
    height: 180,
  },
  imageBackground: {
    width: "100%",
    height: "100%",
  },
  imageStyle: {
    borderTopLeftRadius: Radii.xl,
    borderTopRightRadius: Radii.xl,
  },
  imageOverlay: {
    flex: 1,
    backgroundColor: "rgba(23, 43, 67, 0.72)",
    padding: Spacing.lg,
    justifyContent: "space-between",
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(198, 138, 69, 0.3)",
    borderColor: Palette.wovenGold,
    borderWidth: 1,
    borderRadius: Radii.full,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  badgeText: {
    color: Palette.wovenGold,
    fontSize: 9.5,
    fontWeight: "800",
  },
  heroTitle: {
    color: Palette.surfaceWhite,
    fontSize: 20,
    fontWeight: "900",
  },
  langRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Palette.neutralDivider,
    paddingBottom: Spacing.sm,
  },
  langLabel: {
    color: Palette.textMuted,
    fontSize: 10.5,
    fontWeight: "600",
  },
  langPills: {
    flexDirection: "row",
    gap: 6,
  },
  langPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radii.sm,
    backgroundColor: Palette.neutralSurface,
  },
  langPillActive: {
    backgroundColor: Palette.royalBlue,
  },
  langPillText: {
    color: Palette.textSecondary,
    fontSize: 11,
    fontWeight: "700",
  },
  langPillTextActive: {
    color: Palette.surfaceWhite,
  },
  contentBody: {
    padding: Spacing.lg,
    minHeight: 140,
  },
  stepIndicator: {
    flexDirection: "row",
    gap: 6,
    marginBottom: Spacing.sm,
  },
  dot: {
    width: 20,
    height: 4,
    borderRadius: 2,
    backgroundColor: Palette.neutralBorder,
  },
  dotActive: {
    backgroundColor: Palette.royalBlue,
    width: 32,
  },
  stepTitle: {
    color: Palette.midnightNavy,
    fontSize: 15,
    fontWeight: "800",
    lineHeight: 22,
  },
  stepDesc: {
    color: Palette.textSecondary,
    fontSize: 12.5,
    lineHeight: 18,
    marginTop: 6,
  },
  actionRow: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  primaryBtn: {
    backgroundColor: Palette.royalBlue,
    borderRadius: Radii.md,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: {
    color: Palette.surfaceWhite,
    fontSize: 13,
    fontWeight: "800",
  },
  backBtn: {
    alignItems: "center",
    paddingVertical: 6,
  },
  backBtnText: {
    color: Palette.textMuted,
    fontSize: 12,
    fontWeight: "600",
  },
  btnPressed: {
    opacity: 0.85,
  },
});
