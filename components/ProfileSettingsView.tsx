import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Switch, Alert } from "react-native";
import { Palette, Radii, Shadows, Spacing } from "../theme/theme";
import type { Language, Translations } from "../i18n/translations";
import { money, type EqubState } from "../engine/engine";

interface ProfileSettingsViewProps {
  t: Translations;
  lang: Language;
  onSelectLang: (l: Language) => void;
  state: EqubState;
  onResetDemo: () => void;
  onOpenOnboarding: () => void;
  userName?: string;
  userPhone?: string;
}

export const ProfileSettingsView: React.FC<ProfileSettingsViewProps> = ({
  t,
  lang,
  onSelectLang,
  state,
  onResetDemo,
  onOpenOnboarding,
  userName = "Natnael",
  userPhone = "0911 00 00 01",
}) => {
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [payoutAlertsEnabled, setPayoutAlertsEnabled] = useState(true);

  return (
    <ScrollView contentContainerStyle={styles.content}>
      {/* Page Header */}
      <Text style={styles.pageTitle}>{t.profileTitle}</Text>

      {/* Profile Overview Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatarLarge}>
          <Text style={styles.avatarLargeText}>{userName.slice(0, 1)}</Text>
        </View>

        <View style={styles.profileMeta}>
          <Text style={styles.profileName}>{userName}</Text>
          <Text style={styles.profilePhone}>{userPhone}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>የክበብ አባል • Active Member</Text>
          </View>
        </View>
      </View>

      {/* Circle Statistics */}
      <View style={styles.circleStatsCard}>
        <Text style={styles.circleStatsTitle}>{state.groupName}</Text>
        <View style={styles.statsRow}>
          <View style={styles.statCol}>
            <Text style={styles.statLabel}>አባላት</Text>
            <Text style={styles.statValue}>{state.members.length}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCol}>
            <Text style={styles.statLabel}>ወርሃዊ ክፍያ</Text>
            <Text style={styles.statValue}>{money(state.contributionAmount)}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCol}>
            <Text style={styles.statLabel}>የክፍያ ዙር</Text>
            <Text style={styles.statValue}>1/40</Text>
          </View>
        </View>
      </View>

      {/* Section: Language */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionHeader}>{t.languageSetting}</Text>
        <View style={styles.langButtonRow}>
          <Pressable
            onPress={() => onSelectLang("am")}
            style={[
              styles.langChoiceBtn,
              lang === "am" && styles.langChoiceBtnActive,
            ]}
          >
            <Text
              style={[
                styles.langChoiceText,
                lang === "am" && styles.langChoiceTextActive,
              ]}
            >
              አማርኛ (Amharic)
            </Text>
            {lang === "am" && <Text style={styles.checkMark}>✓</Text>}
          </Pressable>

          <Pressable
            onPress={() => onSelectLang("en")}
            style={[
              styles.langChoiceBtn,
              lang === "en" && styles.langChoiceBtnActive,
            ]}
          >
            <Text
              style={[
                styles.langChoiceText,
                lang === "en" && styles.langChoiceTextActive,
              ]}
            >
              English
            </Text>
            {lang === "en" && <Text style={styles.checkMark}>✓</Text>}
          </Pressable>
        </View>
      </View>

      {/* Section: Notifications */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionHeader}>{t.notificationsTitle}</Text>

        <View style={styles.toggleRow}>
          <View style={styles.toggleLabelWrap}>
            <Text style={styles.toggleTitle}>{t.notificationReminders}</Text>
            <Text style={styles.toggleSub}>የክፍያ ቀን ከማለፉ 3 ቀናት በፊት የኤስኤምኤስ እና የመተግበሪያ ማሳሰቢያ</Text>
          </View>
          <Switch
            value={remindersEnabled}
            onValueChange={setRemindersEnabled}
            trackColor={{ false: Palette.neutralBorder, true: Palette.royalBlue }}
            thumbColor={Palette.surfaceWhite}
          />
        </View>

        <View style={styles.cardDivider} />

        <View style={styles.toggleRow}>
          <View style={styles.toggleLabelWrap}>
            <Text style={styles.toggleTitle}>{t.notificationPayouts}</Text>
            <Text style={styles.toggleSub}>የዙር የዕጣ ውጤቶች እና የተረካቢዎች ማረጋገጫ</Text>
          </View>
          <Switch
            value={payoutAlertsEnabled}
            onValueChange={setPayoutAlertsEnabled}
            trackColor={{ false: Palette.neutralBorder, true: Palette.royalBlue }}
            thumbColor={Palette.surfaceWhite}
          />
        </View>
      </View>

      {/* Walkthrough CTA */}
      <Pressable
        onPress={onOpenOnboarding}
        style={({ pressed }) => [styles.onboardingBtn, pressed && styles.btnPressed]}
      >
        <Text style={styles.onboardingIcon}>📖</Text>
        <View style={styles.onboardingTextGroup}>
          <Text style={styles.onboardingTitle}>የዕቁብ አጠቃቀም መመሪያ</Text>
          <Text style={styles.onboardingSub}>የዲጂታል ዕቁብ አሰራር፣ ግልጽነትና ህግጋት</Text>
        </View>
        <Text style={styles.onboardingArrow}>→</Text>
      </Pressable>

      {/* Section: Security & Privacy */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionHeader}>{t.securityTitle}</Text>
        <View style={styles.securityBox}>
          <Text style={styles.securityText}>{t.localStorageNote}</Text>
        </View>

        <View style={styles.aboutBox}>
          <Text style={styles.aboutHeader}>{t.aboutTitle}</Text>
          <Text style={styles.aboutText}>{t.aboutText}</Text>
        </View>

        {/* Reset Demo Data Button */}
        <Pressable
          onPress={onResetDemo}
          style={({ pressed }) => [styles.resetBtn, pressed && styles.btnPressed]}
        >
          <Text style={styles.resetBtnText}>↺ {t.resetDemoBtn}</Text>
        </Pressable>
      </View>

      <Text style={styles.versionFooter}>
        ዲጂታል ዕቁብ (Digital Equb) • Version 1.0.0
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.hero,
  },
  pageTitle: {
    color: Palette.midnightNavy,
    fontSize: 20,
    fontWeight: "800",
    marginBottom: Spacing.md,
  },
  profileCard: {
    backgroundColor: Palette.surfaceWhite,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Palette.neutralBorder,
    padding: Spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    ...Shadows.subtle,
  },
  avatarLarge: {
    width: 52,
    height: 52,
    borderRadius: Radii.full,
    backgroundColor: Palette.midnightNavy,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Palette.wovenGold,
  },
  avatarLargeText: {
    color: Palette.wovenGold,
    fontSize: 22,
    fontWeight: "900",
  },
  profileMeta: {
    flex: 1,
  },
  profileName: {
    color: Palette.midnightNavy,
    fontSize: 17,
    fontWeight: "800",
  },
  profilePhone: {
    color: Palette.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  roleBadge: {
    backgroundColor: Palette.neutralSurface,
    borderRadius: Radii.full,
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 6,
  },
  roleBadgeText: {
    color: Palette.textSecondary,
    fontSize: 9.5,
    fontWeight: "700",
  },
  circleStatsCard: {
    backgroundColor: Palette.neutralSurface,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: Palette.neutralBorder,
    padding: Spacing.md,
    marginVertical: Spacing.md,
  },
  circleStatsTitle: {
    color: Palette.midnightNavy,
    fontSize: 13,
    fontWeight: "800",
    marginBottom: Spacing.sm,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  statCol: {
    flex: 1,
    alignItems: "center",
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: Palette.neutralBorder,
  },
  statLabel: {
    color: Palette.textMuted,
    fontSize: 10,
    fontWeight: "600",
  },
  statValue: {
    color: Palette.midnightNavy,
    fontSize: 13,
    fontWeight: "800",
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: Palette.surfaceWhite,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Palette.neutralBorder,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.subtle,
  },
  sectionHeader: {
    color: Palette.midnightNavy,
    fontSize: 14,
    fontWeight: "800",
    marginBottom: Spacing.md,
  },
  langButtonRow: {
    gap: Spacing.sm,
  },
  langChoiceBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Palette.neutralSurface,
    borderRadius: Radii.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Palette.neutralBorder,
  },
  langChoiceBtnActive: {
    backgroundColor: Palette.royalBlueLight,
    borderColor: Palette.royalBlue,
  },
  langChoiceText: {
    color: Palette.midnightNavy,
    fontSize: 13,
    fontWeight: "600",
  },
  langChoiceTextActive: {
    color: Palette.royalBlue,
    fontWeight: "800",
  },
  checkMark: {
    color: Palette.royalBlue,
    fontSize: 14,
    fontWeight: "900",
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.md,
  },
  toggleLabelWrap: {
    flex: 1,
  },
  toggleTitle: {
    color: Palette.midnightNavy,
    fontSize: 12.5,
    fontWeight: "700",
  },
  toggleSub: {
    color: Palette.textMuted,
    fontSize: 10.5,
    marginTop: 2,
    lineHeight: 14,
  },
  cardDivider: {
    height: 1,
    backgroundColor: Palette.neutralDivider,
    marginVertical: Spacing.md,
  },
  onboardingBtn: {
    backgroundColor: Palette.surfaceWhite,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: Palette.neutralBorder,
    padding: Spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.subtle,
  },
  onboardingIcon: {
    fontSize: 22,
  },
  onboardingTextGroup: {
    flex: 1,
  },
  onboardingTitle: {
    color: Palette.midnightNavy,
    fontSize: 13,
    fontWeight: "800",
  },
  onboardingSub: {
    color: Palette.textMuted,
    fontSize: 10.5,
    marginTop: 2,
  },
  onboardingArrow: {
    color: Palette.royalBlue,
    fontSize: 16,
    fontWeight: "800",
  },
  securityBox: {
    backgroundColor: Palette.neutralSurface,
    borderRadius: Radii.sm,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  securityText: {
    color: Palette.textSecondary,
    fontSize: 11,
    lineHeight: 16,
  },
  aboutBox: {
    marginBottom: Spacing.md,
  },
  aboutHeader: {
    color: Palette.midnightNavy,
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 4,
  },
  aboutText: {
    color: Palette.textMuted,
    fontSize: 11,
    lineHeight: 16,
  },
  resetBtn: {
    backgroundColor: Palette.rejectedRedSurface,
    borderWidth: 1,
    borderColor: Palette.rejectedRedBorder,
    borderRadius: Radii.md,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  resetBtnText: {
    color: Palette.rejectedRed,
    fontSize: 12,
    fontWeight: "800",
  },
  versionFooter: {
    textAlign: "center",
    color: Palette.textMuted,
    fontSize: 11,
    marginTop: Spacing.xs,
  },
  btnPressed: {
    opacity: 0.85,
  },
});
