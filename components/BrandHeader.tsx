import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Palette, Radii, Shadows, Spacing, Typography } from "../theme/theme";
import type { Language, Translations } from "../i18n/translations";

interface BrandHeaderProps {
  t: Translations;
  lang: Language;
  onToggleLang: () => void;
  onOpenNotifications?: () => void;
  onOpenProfile?: () => void;
  userName?: string;
}

export const BrandHeader: React.FC<BrandHeaderProps> = ({
  t,
  lang,
  onToggleLang,
  onOpenNotifications,
  onOpenProfile,
  userName = "Natnael",
}) => {
  return (
    <View style={styles.container}>
      {/* Top Brand Bar */}
      <View style={styles.topRow}>
        <View style={styles.brandGroup}>
          <View style={styles.mesobIconBadge}>
            <Text style={styles.mesobIconText}>ዕ</Text>
          </View>
          <View>
            <View style={styles.brandTitleRow}>
              <Text style={styles.brandTitle}>{t.appName}</Text>
              <View style={styles.demoPill}>
                <View style={styles.demoDot} />
                <Text style={styles.demoText}>{t.demoLabel}</Text>
              </View>
            </View>
            <Text style={styles.brandSubtitle}>{t.tagline}</Text>
          </View>
        </View>

        {/* Header Actions: Language Switch & Profile Avatar */}
        <View style={styles.actionsRow}>
          <Pressable
            onPress={onToggleLang}
            style={({ pressed }) => [styles.langButton, pressed && styles.btnPressed]}
            accessibilityLabel="Switch language"
          >
            <Text style={styles.langText}>
              {lang === "am" ? "EN" : "አማ"}
            </Text>
          </Pressable>

          <Pressable
            onPress={onOpenProfile}
            style={({ pressed }) => [styles.avatarButton, pressed && styles.btnPressed]}
          >
            <Text style={styles.avatarText}>{userName.slice(0, 1)}</Text>
          </Pressable>
        </View>
      </View>

      {/* Greeting Row */}
      <View style={styles.greetingRow}>
        <Text style={styles.greetingText}>
          {t.greetingEvening},{" "}
          <Text style={styles.userNameHighlight}>{userName}</Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Palette.midnightNavy,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brandGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  mesobIconBadge: {
    width: 38,
    height: 38,
    borderRadius: Radii.sm,
    backgroundColor: Palette.wovenGold,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.subtle,
  },
  mesobIconText: {
    color: Palette.surfaceWhite,
    fontSize: 20,
    fontWeight: "900",
  },
  brandTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs + 2,
  },
  brandTitle: {
    color: Palette.textOnDark,
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 2,
  },
  brandSubtitle: {
    color: Palette.textOnDarkMuted,
    fontSize: 10,
    fontWeight: "500",
    marginTop: 1,
  },
  demoPill: {
    backgroundColor: "rgba(198, 138, 69, 0.2)",
    borderColor: Palette.wovenGold,
    borderWidth: 1,
    borderRadius: Radii.full,
    paddingHorizontal: 7,
    paddingVertical: 2,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  demoDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: Palette.wovenGold,
  },
  demoText: {
    color: Palette.wovenGold,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  langButton: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
    borderRadius: Radii.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  langText: {
    color: Palette.surfaceWhite,
    fontSize: 11,
    fontWeight: "800",
  },
  avatarButton: {
    width: 36,
    height: 36,
    borderRadius: Radii.full,
    backgroundColor: Palette.royalBlue,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.3)",
  },
  avatarText: {
    color: Palette.surfaceWhite,
    fontSize: 15,
    fontWeight: "800",
  },
  greetingRow: {
    marginTop: Spacing.md,
  },
  greetingText: {
    color: Palette.textOnDarkMuted,
    fontSize: 14,
    fontWeight: "500",
  },
  userNameHighlight: {
    color: Palette.surfaceWhite,
    fontWeight: "800",
    fontSize: 16,
  },
  btnPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});
