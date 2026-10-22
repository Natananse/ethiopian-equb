import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Palette, Radii, Shadows, Spacing, Typography } from "../theme/theme";
import type { Translations } from "../i18n/translations";
import { money } from "../engine/engine";

interface FinancialSummaryProps {
  t: Translations;
  confirmedTotal: number;
  activeCirclesCount: number;
  nextDueDate: string;
  nextDueAmount: number;
  upcomingPayoutAmount: number;
  upcomingPayoutRecipient: string;
  outstandingTotal: number;
}

export const FinancialSummary: React.FC<FinancialSummaryProps> = ({
  t,
  confirmedTotal,
  activeCirclesCount,
  nextDueDate,
  nextDueAmount,
  upcomingPayoutAmount,
  upcomingPayoutRecipient,
  outstandingTotal,
}) => {
  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>{t.financialOverview}</Text>
        <View style={styles.verifiedBadge}>
          <Text style={styles.verifiedText}>✓ ተረጋግጧል • VERIFIED</Text>
        </View>
      </View>

      {/* 4-Stat Grid */}
      <View style={styles.grid}>
        {/* Confirmed Collection */}
        <View style={[styles.statCard, styles.confirmedCard]}>
          <Text style={styles.cardLabel}>{t.totalConfirmed}</Text>
          <Text style={[styles.cardValue, { color: Palette.confirmedGreen }]}>
            {money(confirmedTotal)}
          </Text>
          <Text style={styles.cardSubtext}>
            {activeCirclesCount > 0 ? "በዚህ ዙር የተሰበሰበ" : "በክበብ የተረጋገጠ"}
          </Text>
        </View>

        {/* Active Circles */}
        <View style={styles.statCard}>
          <Text style={styles.cardLabel}>{t.activeCircles}</Text>
          <Text style={[styles.cardValue, { color: Palette.midnightNavy }]}>
            {activeCirclesCount}
          </Text>
          <Text style={styles.cardSubtext}>
            {activeCirclesCount === 1 ? "1 ንቁ የቁጠባ ክበብ" : `${activeCirclesCount} ንቁ ክበቦች`}
          </Text>
        </View>

        {/* Next Contribution Due */}
        <View style={styles.statCard}>
          <Text style={styles.cardLabel}>{t.nextDueContribution}</Text>
          <Text style={[styles.cardValue, { color: Palette.royalBlue }]}>
            {money(nextDueAmount)}
          </Text>
          <Text style={styles.cardSubtext} numberOfLines={1}>
            ቀን፦ {nextDueDate}
          </Text>
        </View>

        {/* Upcoming Payout */}
        <View style={[styles.statCard, styles.payoutCard]}>
          <Text style={styles.cardLabel}>{t.upcomingPayout}</Text>
          <Text style={[styles.cardValue, { color: Palette.wovenGoldDark }]}>
            {money(upcomingPayoutAmount)}
          </Text>
          <Text style={styles.cardSubtext} numberOfLines={1}>
            ለ {upcomingPayoutRecipient}
          </Text>
        </View>
      </View>

      {/* Outstanding balance alert if applicable */}
      {outstandingTotal > 0 && (
        <View style={styles.outstandingBanner}>
          <View style={styles.alertIconBadge}>
            <Text style={styles.alertIconText}>!</Text>
          </View>
          <View style={styles.alertTextGroup}>
            <Text style={styles.alertTitle}>
              {t.outstandingBalance}: {money(outstandingTotal)}
            </Text>
            <Text style={styles.alertSub}>
              የዚህ ዙር ያልተከፈሉ የቀሩ ክፍያዎች አጠቃላይ ድምር
            </Text>
          </View>
        </View>
      )}

      {/* Honest Financial Tracking Disclaimer */}
      <View style={styles.disclaimerContainer}>
        <Text style={styles.disclaimerIcon}>ℹ</Text>
        <Text style={styles.disclaimerText}>{t.trackedFundsDisclaimer}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    color: Palette.midnightNavy,
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  verifiedBadge: {
    backgroundColor: Palette.confirmedGreenSurface,
    borderColor: Palette.confirmedGreenBorder,
    borderWidth: 1,
    borderRadius: Radii.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  verifiedText: {
    color: Palette.confirmedGreen,
    fontSize: 9,
    fontWeight: "800",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  statCard: {
    backgroundColor: Palette.surfaceWhite,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: Palette.neutralBorder,
    padding: Spacing.md,
    width: "48.5%",
    minHeight: 88,
    justifyContent: "space-between",
    ...Shadows.subtle,
  },
  confirmedCard: {
    borderLeftWidth: 3,
    borderLeftColor: Palette.confirmedGreen,
  },
  payoutCard: {
    borderLeftWidth: 3,
    borderLeftColor: Palette.wovenGold,
  },
  cardLabel: {
    color: Palette.textSecondary,
    fontSize: 11,
    fontWeight: "600",
  },
  cardValue: {
    fontSize: 17,
    fontWeight: "800",
    marginVertical: 2,
  },
  cardSubtext: {
    color: Palette.textMuted,
    fontSize: 10,
    fontWeight: "500",
  },
  outstandingBanner: {
    marginTop: Spacing.sm,
    backgroundColor: Palette.pendingAmberSurface,
    borderRadius: Radii.sm,
    borderWidth: 1,
    borderColor: Palette.pendingAmberBorder,
    padding: Spacing.sm + 2,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  alertIconBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Palette.pendingAmber,
    alignItems: "center",
    justifyContent: "center",
  },
  alertIconText: {
    color: Palette.surfaceWhite,
    fontSize: 13,
    fontWeight: "900",
  },
  alertTextGroup: {
    flex: 1,
  },
  alertTitle: {
    color: Palette.pendingAmber,
    fontSize: 12,
    fontWeight: "700",
  },
  alertSub: {
    color: "#8C5819",
    fontSize: 10,
    marginTop: 1,
  },
  disclaimerContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    marginTop: Spacing.sm,
    paddingHorizontal: 4,
  },
  disclaimerIcon: {
    color: Palette.textMuted,
    fontSize: 12,
    marginTop: 1,
  },
  disclaimerText: {
    flex: 1,
    color: Palette.textMuted,
    fontSize: 10.5,
    lineHeight: 15,
  },
});
