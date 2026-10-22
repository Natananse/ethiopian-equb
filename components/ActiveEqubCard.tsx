import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Palette, Radii, Shadows, Spacing, Typography } from "../theme/theme";
import type { Translations } from "../i18n/translations";
import { money } from "../engine/engine";

interface ActiveEqubCardProps {
  t: Translations;
  groupName: string;
  contributionAmount: number;
  memberCount: number;
  paidMembersCount: number;
  progressPercent: number;
  nextPayoutDate: string;
  nextPayoutRecipient: string;
  isUserPaid: boolean;
  onPressDetails: () => void;
  onRecordPayment: () => void;
}

export const ActiveEqubCard: React.FC<ActiveEqubCardProps> = ({
  t,
  groupName,
  contributionAmount,
  memberCount,
  paidMembersCount,
  progressPercent,
  nextPayoutDate,
  nextPayoutRecipient,
  isUserPaid,
  onPressDetails,
  onRecordPayment,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Top Header: Group Name, Members Tag, User Status */}
        <View style={styles.headerRow}>
          <View style={styles.groupMeta}>
            <View style={styles.groupAvatar}>
              <Text style={styles.groupAvatarText}>ዕ</Text>
            </View>
            <View>
              <Text style={styles.groupName}>{groupName}</Text>
              <Text style={styles.groupSub}>
                {memberCount} {t.circleMembers} • {money(contributionAmount)} / ወር
              </Text>
            </View>
          </View>

          {/* User's Payment Status Badge */}
          <View
            style={[
              styles.userStatusBadge,
              isUserPaid ? styles.userPaidBadge : styles.userUnpaidBadge,
            ]}
          >
            <Text
              style={[
                styles.userStatusText,
                isUserPaid ? styles.userPaidText : styles.userUnpaidText,
              ]}
            >
              {isUserPaid ? `✓ ${t.statusPaid}` : `⏳ ${t.statusUnpaid}`}
            </Text>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Collection Progress Bar */}
        <View style={styles.progressSection}>
          <View style={styles.progressLabelRow}>
            <Text style={styles.progressLabel}>{t.cycleProgress}</Text>
            <Text style={styles.progressNumbers}>
              <Text style={styles.boldProgress}>{paidMembersCount}</Text>
              <Text style={styles.totalMembers}>/{memberCount} አባላት ከፍለዋል ({progressPercent}%)</Text>
            </Text>
          </View>

          <View style={styles.track}>
            <View style={[styles.fill, { width: `${Math.max(4, Math.min(progressPercent, 100))}%` }]} />
          </View>
        </View>

        {/* Payout & Action Bottom Row */}
        <View style={styles.bottomRow}>
          <View style={styles.payoutInfo}>
            <Text style={styles.payoutLabel}>ቀጣይ ምደባ (ተረካቢ)</Text>
            <Text style={styles.payoutRecipient} numberOfLines={1}>
              {nextPayoutRecipient}
            </Text>
            <Text style={styles.payoutDate}>{nextPayoutDate}</Text>
          </View>

          <View style={styles.actionButtonsGroup}>
            {!isUserPaid && (
              <Pressable
                onPress={onRecordPayment}
                style={({ pressed }) => [styles.payNowBtn, pressed && styles.btnPressed]}
              >
                <Text style={styles.payNowText}>ክፈል</Text>
              </Pressable>
            )}

            <Pressable
              onPress={onPressDetails}
              style={({ pressed }) => [styles.detailsBtn, pressed && styles.btnPressed]}
            >
              <Text style={styles.detailsBtnText}>{t.viewCircleDetails} →</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xs,
  },
  card: {
    backgroundColor: Palette.surfaceWhite,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Palette.neutralBorder,
    padding: Spacing.lg,
    ...Shadows.card,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  groupMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm + 2,
    flex: 1,
  },
  groupAvatar: {
    width: 42,
    height: 42,
    borderRadius: Radii.md,
    backgroundColor: Palette.midnightNavy,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Palette.wovenGold,
  },
  groupAvatarText: {
    color: Palette.wovenGold,
    fontSize: 20,
    fontWeight: "900",
  },
  groupName: {
    color: Palette.midnightNavy,
    fontSize: 16,
    fontWeight: "800",
  },
  groupSub: {
    color: Palette.textSecondary,
    fontSize: 11.5,
    fontWeight: "500",
    marginTop: 2,
  },
  userStatusBadge: {
    borderRadius: Radii.full,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderWidth: 1,
  },
  userPaidBadge: {
    backgroundColor: Palette.confirmedGreenSurface,
    borderColor: Palette.confirmedGreenBorder,
  },
  userUnpaidBadge: {
    backgroundColor: Palette.pendingAmberSurface,
    borderColor: Palette.pendingAmberBorder,
  },
  userStatusText: {
    fontSize: 10,
    fontWeight: "800",
  },
  userPaidText: {
    color: Palette.confirmedGreen,
  },
  userUnpaidText: {
    color: Palette.pendingAmber,
  },
  divider: {
    height: 1,
    backgroundColor: Palette.neutralDivider,
    marginVertical: Spacing.md,
  },
  progressSection: {
    gap: 6,
  },
  progressLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  progressLabel: {
    color: Palette.textSecondary,
    fontSize: 12,
    fontWeight: "600",
  },
  progressNumbers: {
    fontSize: 11,
  },
  boldProgress: {
    color: Palette.midnightNavy,
    fontWeight: "800",
    fontSize: 12,
  },
  totalMembers: {
    color: Palette.textMuted,
    fontWeight: "500",
  },
  track: {
    height: 9,
    backgroundColor: Palette.neutralSurface,
    borderRadius: Radii.full,
    overflow: "hidden",
  },
  fill: {
    height: 9,
    backgroundColor: Palette.royalBlue,
    borderRadius: Radii.full,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginTop: Spacing.md,
    paddingTop: Spacing.xs,
  },
  payoutInfo: {
    flex: 1,
  },
  payoutLabel: {
    color: Palette.textMuted,
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  payoutRecipient: {
    color: Palette.midnightNavy,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 2,
  },
  payoutDate: {
    color: Palette.textSecondary,
    fontSize: 11,
    marginTop: 1,
  },
  actionButtonsGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs + 2,
  },
  payNowBtn: {
    backgroundColor: Palette.royalBlue,
    borderRadius: Radii.sm,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  payNowText: {
    color: Palette.surfaceWhite,
    fontSize: 11.5,
    fontWeight: "800",
  },
  detailsBtn: {
    backgroundColor: Palette.neutralSurface,
    borderRadius: Radii.sm,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  detailsBtnText: {
    color: Palette.midnightNavy,
    fontSize: 11.5,
    fontWeight: "700",
  },
  btnPressed: {
    opacity: 0.8,
  },
});
