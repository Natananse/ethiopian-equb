import React from "react";
import { View, Text, StyleSheet, Pressable, ImageBackground } from "react-native";
import { Palette, Radii, Shadows, Spacing, Typography } from "../theme/theme";
import type { Translations } from "../i18n/translations";

interface CulturalHeroProps {
  t: Translations;
  onCreateEqub: () => void;
  onExploreEqubs: () => void;
}

export const CulturalHero: React.FC<CulturalHeroProps> = ({
  t,
  onCreateEqub,
  onExploreEqubs,
}) => {
  return (
    <View style={styles.outerContainer}>
      <ImageBackground
        source={require("../assets/equb-gathering.jpg")}
        style={styles.imageBackground}
        imageStyle={styles.imageStyle}
        resizeMode="cover"
      >
        {/* Layered dark contrast overlay for readability */}
        <View style={styles.overlay}>
          {/* Subtle cultural badge */}
          <View style={styles.tagBadge}>
            <View style={styles.tagDot} />
            <Text style={styles.tagText}>ማህበረሰባዊ ቁጠባ • COMMUNITY SAVINGS</Text>
          </View>

          {/* Core headlines */}
          <View style={styles.textGroup}>
            <Text style={styles.headline}>{t.heroHeadline}</Text>
            <Text style={styles.subtext}>{t.heroSubtext}</Text>
          </View>

          {/* Primary & Secondary Call to Actions */}
          <View style={styles.buttonRow}>
            <Pressable
              onPress={onCreateEqub}
              style={({ pressed }) => [styles.primaryButton, pressed && styles.btnPressed]}
              accessibilityRole="button"
            >
              <Text style={styles.primaryButtonIcon}>＋</Text>
              <Text style={styles.primaryButtonText}>{t.ctaCreateEqub}</Text>
            </Pressable>

            <Pressable
              onPress={onExploreEqubs}
              style={({ pressed }) => [styles.secondaryButton, pressed && styles.btnPressed]}
              accessibilityRole="button"
            >
              <Text style={styles.secondaryButtonText}>{t.ctaExploreEqubs}</Text>
            </Pressable>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  imageBackground: {
    borderRadius: Radii.lg,
    overflow: "hidden",
    minHeight: 220,
    ...Shadows.card,
  },
  imageStyle: {
    borderRadius: Radii.lg,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15, 29, 45, 0.78)",
    padding: Spacing.lg,
    justifyContent: "space-between",
  },
  tagBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(198, 138, 69, 0.25)",
    borderColor: "rgba(198, 138, 69, 0.8)",
    borderWidth: 1,
    borderRadius: Radii.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  tagDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Palette.wovenGold,
  },
  tagText: {
    color: Palette.wovenGold,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.6,
  },
  textGroup: {
    marginVertical: Spacing.md,
  },
  headline: {
    color: Palette.surfaceWhite,
    fontSize: 22,
    fontWeight: "800",
    lineHeight: 28,
  },
  subtext: {
    color: "#E2E8F0",
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 18,
    marginTop: 6,
    opacity: 0.95,
  },
  buttonRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: Palette.royalBlue,
    borderRadius: Radii.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    ...Shadows.subtle,
  },
  primaryButtonIcon: {
    color: Palette.surfaceWhite,
    fontSize: 14,
    fontWeight: "800",
  },
  primaryButtonText: {
    color: Palette.surfaceWhite,
    fontSize: 13,
    fontWeight: "800",
  },
  secondaryButton: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4)",
    borderRadius: Radii.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: Palette.surfaceWhite,
    fontSize: 13,
    fontWeight: "700",
  },
  btnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});
