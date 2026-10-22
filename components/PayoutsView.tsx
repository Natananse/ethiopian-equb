import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from "react-native";
import { Palette, Radii, Shadows, Spacing } from "../theme/theme";
import type { Translations } from "../i18n/translations";
import { money, type EqubState, type Payout, confirmedCollection } from "../engine/engine";

interface PayoutsViewProps {
  t: Translations;
  state: EqubState;
  onApprovePayout: (payoutId: string) => void;
  getMemberName: (id: string) => string;
}

export const PayoutsView: React.FC<PayoutsViewProps> = ({
  t,
  state,
  onApprovePayout,
  getMemberName,
}) => {
  const handleApprove = (payout: Payout) => {
    const recipient = getMemberName(payout.recipientMemberId);
    const available = confirmedCollection(state, payout.cycleId);

    if (payout.netAmount > available) {
      Alert.alert(
        "ገንዘብ አልተሟላም • Insufficient Funds",
        `ይህ ምደባ ${money(payout.netAmount)} የሚፈልግ ሲሆን እስካሁን የተሰበሰበው የተረጋገጠ ገቢ ${money(available)} ብቻ ነው። ምደባ ለማጽደቅ የተረጋገጠው ገንዘብ መሟላት አለበት።`
      );
      return;
    }

    Alert.alert(
      t.approvePayoutPrompt,
      `ለ${recipient} የ ${money(payout.netAmount)} ምደባ በትክክል መፈጸሙን ያረጋግጡ? ይህ እርምጃ በፋይናንስ መዝገቡ ላይ ጸድቆ ይመዘገባል።`,
      [
        { text: t.cancel, style: "cancel" },
        {
          text: t.confirm,
          style: "default",
          onPress: () => onApprovePayout(payout.id),
        },
      ]
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return {
          bg: Palette.confirmedGreenSurface,
          border: Palette.confirmedGreenBorder,
          text: Palette.confirmedGreen,
          label: t.statusPaidOut,
        };
      case "pending_approval":
        return {
          bg: Palette.pendingAmberSurface,
          border: Palette.pendingAmberBorder,
          text: Palette.pendingAmber,
          label: "ማጽደቅ ይጠብቃል",
        };
      case "scheduled":
        return {
          bg: Palette.wovenGoldLight,
          border: Palette.wovenGold,
          text: Palette.wovenGoldDark,
          label: t.statusScheduled,
        };
      default:
        return {
          bg: Palette.neutralSurface,
          border: Palette.neutralBorder,
          text: Palette.textMuted,
          label: status,
        };
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{t.payoutsTitle}</Text>
        <Text style={styles.subtitle}>{t.payoutsSubtitle}</Text>
      </View>

      {/* Safety Notice Banner */}
      <View style={styles.warningCard}>
        <Text style={styles.warningIcon}>⚖</Text>
        <Text style={styles.warningText}>{t.payoutWarning}</Text>
      </View>

      {/* Payout Cards */}
      <View style={styles.list}>
        {state.payouts.map((payout, index) => {
          const recipientName = getMemberName(payout.recipientMemberId);
          const cycle = state.cycles.find((c) => c.id === payout.cycleId);
          const cycleLabel = cycle?.label || `ዙር ${index + 1}`;
          const badge = getStatusBadge(payout.status);
          const canApprove = payout.status === "pending_approval";

          return (
            <View key={payout.id} style={styles.payoutCard}>
              {/* Card Header */}
              <View style={styles.cardHeader}>
                <View style={styles.cycleBadge}>
                  <Text style={styles.cycleBadgeText}>{cycleLabel}</Text>
                </View>

                <View
                  style={[
                    styles.statusPill,
                    { backgroundColor: badge.bg, borderColor: badge.border },
                  ]}
                >
                  <Text style={[styles.statusPillText, { color: badge.text }]}>
                    {badge.label}
                  </Text>
                </View>
              </View>

              {/* Recipient */}
              <View style={styles.recipientRow}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{recipientName.slice(0, 1)}</Text>
                </View>
                <View style={styles.recipientInfo}>
                  <Text style={styles.recipientLabel}>{t.currentRecipient}</Text>
                  <Text style={styles.recipientName}>{recipientName}</Text>
                </View>
              </View>

              {/* Amount Breakdown Box */}
              <View style={styles.breakdownBox}>
                <View style={styles.amountHeroRow}>
                  <Text style={styles.netAmountLabel}>{t.netPayoutAmount}</Text>
                  <Text style={styles.netAmountValue}>
                    {money(payout.netAmount)}
                  </Text>
                </View>

                <View style={styles.breakdownDivider} />

                <View style={styles.breakdownDetails}>
                  <Text style={styles.breakdownText}>
                    {t.grossAmount}: {money(payout.grossAmount)}
                  </Text>
                  <Text style={styles.breakdownText}>
                    {t.approvedDeductions}: {money(payout.deductions)}
                  </Text>
                </View>
              </View>

              {/* Evidence / Demo Note */}
              {payout.evidenceNote && (
                <View style={styles.noteBox}>
                  <Text style={styles.noteText}>ℹ {payout.evidenceNote}</Text>
                </View>
              )}

              {/* Action Button */}
              {canApprove && (
                <Pressable
                  onPress={() => handleApprove(payout)}
                  style={({ pressed }) => [styles.approveBtn, pressed && styles.btnPressed]}
                >
                  <Text style={styles.approveBtnText}>✓ {t.approvePayoutBtn}</Text>
                </Pressable>
              )}
            </View>
          );
        })}

        {state.payouts.length === 0 && (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>ምንም የታቀደ ምደባ የለም።</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.hero,
  },
  header: {
    marginBottom: Spacing.md,
  },
  title: {
    color: Palette.midnightNavy,
    fontSize: 20,
    fontWeight: "800",
  },
  subtitle: {
    color: Palette.textSecondary,
    fontSize: 11.5,
    marginTop: 2,
    lineHeight: 16,
  },
  warningCard: {
    backgroundColor: Palette.wovenGoldLight,
    borderLeftWidth: 3,
    borderLeftColor: Palette.wovenGold,
    borderRadius: Radii.xs,
    padding: Spacing.sm,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: Spacing.md,
  },
  warningIcon: {
    fontSize: 14,
  },
  warningText: {
    flex: 1,
    color: Palette.wovenGoldDark,
    fontSize: 11,
    lineHeight: 16,
  },
  list: {
    gap: Spacing.md,
  },
  payoutCard: {
    backgroundColor: Palette.surfaceWhite,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Palette.neutralBorder,
    padding: Spacing.lg,
    ...Shadows.card,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.sm,
  },
  cycleBadge: {
    backgroundColor: Palette.neutralSurface,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radii.sm,
  },
  cycleBadgeText: {
    color: Palette.midnightNavy,
    fontSize: 10,
    fontWeight: "700",
  },
  statusPill: {
    borderWidth: 1,
    borderRadius: Radii.full,
    paddingHorizontal: 9,
    paddingVertical: 2,
  },
  statusPillText: {
    fontSize: 9.5,
    fontWeight: "800",
  },
  recipientRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm + 2,
    marginVertical: Spacing.sm,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: Radii.md,
    backgroundColor: Palette.midnightNavy,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: Palette.wovenGold,
  },
  avatarText: {
    color: Palette.wovenGold,
    fontSize: 20,
    fontWeight: "900",
  },
  recipientInfo: {
    flex: 1,
  },
  recipientLabel: {
    color: Palette.textMuted,
    fontSize: 10,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  recipientName: {
    color: Palette.midnightNavy,
    fontSize: 15,
    fontWeight: "800",
    marginTop: 1,
  },
  breakdownBox: {
    backgroundColor: Palette.neutralSurface,
    borderRadius: Radii.md,
    padding: Spacing.md,
    marginVertical: Spacing.sm,
  },
  amountHeroRow: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  netAmountLabel: {
    color: Palette.textSecondary,
    fontSize: 11.5,
    fontWeight: "700",
  },
  netAmountValue: {
    color: Palette.royalBlue,
    fontSize: 19,
    fontWeight: "900",
  },
  breakdownDivider: {
    height: 1,
    backgroundColor: Palette.neutralBorder,
    marginVertical: Spacing.sm,
  },
  breakdownDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  breakdownText: {
    color: Palette.textMuted,
    fontSize: 10.5,
    fontWeight: "500",
  },
  noteBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: Radii.xs,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  noteText: {
    color: Palette.textMuted,
    fontSize: 10,
  },
  approveBtn: {
    backgroundColor: Palette.royalBlue,
    borderRadius: Radii.md,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing.xs,
  },
  approveBtnText: {
    color: Palette.surfaceWhite,
    fontSize: 12.5,
    fontWeight: "800",
  },
  emptyCard: {
    backgroundColor: Palette.surfaceWhite,
    borderRadius: Radii.md,
    padding: Spacing.xl,
    alignItems: "center",
  },
  emptyText: {
    color: Palette.textMuted,
    fontSize: 12,
  },
  btnPressed: {
    opacity: 0.85,
  },
});
