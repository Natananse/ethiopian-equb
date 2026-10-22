import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { Palette, Radii, Shadows, Spacing } from "../theme/theme";
import type { Translations } from "../i18n/translations";
import {
  money,
  type EqubState,
  type Contribution,
  expectedCollection,
  confirmedCollection,
  outstandingCollection,
} from "../engine/engine";

interface ContributionsViewProps {
  t: Translations;
  state: EqubState;
  activeCycleId: string;
  onRecordPayment: () => void;
  onVerifyPayment: (payment: Contribution, confirmed: boolean) => void;
  getMemberName: (id: string) => string;
}

export const ContributionsView: React.FC<ContributionsViewProps> = ({
  t,
  state,
  activeCycleId,
  onRecordPayment,
  onVerifyPayment,
  getMemberName,
}) => {
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed" | "rejected">("all");

  const expected = expectedCollection(state, activeCycleId);
  const confirmed = confirmedCollection(state, activeCycleId);
  const outstanding = outstandingCollection(state, activeCycleId);

  const pendingList = state.contributions.filter(
    (c) => c.cycleId === activeCycleId && c.status === "pending"
  );
  const confirmedList = state.contributions.filter(
    (c) => c.cycleId === activeCycleId && c.status === "confirmed"
  );
  const rejectedList = state.contributions.filter(
    (c) => c.cycleId === activeCycleId && c.status === "rejected"
  );

  const displayedList = state.contributions
    .slice()
    .reverse()
    .filter((c) => {
      if (filter === "pending") return c.status === "pending";
      if (filter === "confirmed") return c.status === "confirmed";
      if (filter === "rejected") return c.status === "rejected";
      return true;
    });

  const getStatusBadge = (status: string) => {
    if (status === "confirmed") {
      return {
        bg: Palette.confirmedGreenSurface,
        border: Palette.confirmedGreenBorder,
        text: Palette.confirmedGreen,
        label: t.statusConfirmed,
      };
    }
    if (status === "pending") {
      return {
        bg: Palette.pendingAmberSurface,
        border: Palette.pendingAmberBorder,
        text: Palette.pendingAmber,
        label: t.statusPending,
      };
    }
    return {
      bg: Palette.rejectedRedSurface,
      border: Palette.rejectedRedBorder,
      text: Palette.rejectedRed,
      label: t.statusRejected,
    };
  };

  return (
    <ScrollView contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.pageTitle}>{t.paymentsTitle}</Text>
          <Text style={styles.pageSubtitle}>{t.paymentsSubtitle}</Text>
        </View>

        <Pressable
          onPress={onRecordPayment}
          style={({ pressed }) => [styles.recordBtn, pressed && styles.btnPressed]}
        >
          <Text style={styles.recordBtnText}>＋ {t.recordPaymentBtn}</Text>
        </Pressable>
      </View>

      {/* 3-Part Financial Accounting Summary */}
      <View style={styles.summaryBox}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>የሚጠበቅ ገቢ</Text>
          <Text style={styles.summaryValue}>{money(expected)}</Text>
        </View>

        <View style={styles.summaryDivider} />

        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>የተረጋገጠ ገቢ</Text>
          <Text style={[styles.summaryValue, { color: Palette.confirmedGreen }]}>
            {money(confirmed)}
          </Text>
        </View>

        <View style={styles.summaryDivider} />

        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>ያልተሰበሰበ ቀሪ</Text>
          <Text style={[styles.summaryValue, { color: Palette.pendingAmber }]}>
            {money(outstanding)}
          </Text>
        </View>
      </View>

      {/* Verification Notice */}
      <View style={styles.noticeContainer}>
        <Text style={styles.noticeIcon}>🛡</Text>
        <Text style={styles.noticeText}>{t.paymentPendingNotice}</Text>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        <Pressable
          onPress={() => setFilter("all")}
          style={[styles.filterChip, filter === "all" && styles.filterChipActive]}
        >
          <Text style={[styles.filterText, filter === "all" && styles.filterTextActive]}>
            ሁሉም ({state.contributions.length})
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setFilter("pending")}
          style={[styles.filterChip, filter === "pending" && styles.filterChipActive]}
        >
          <Text style={[styles.filterText, filter === "pending" && styles.filterTextActive]}>
            ማረጋገጫ የሚጠብቁ ({pendingList.length})
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setFilter("confirmed")}
          style={[styles.filterChip, filter === "confirmed" && styles.filterChipActive]}
        >
          <Text style={[styles.filterText, filter === "confirmed" && styles.filterTextActive]}>
            የተረጋገጡ ({confirmedList.length})
          </Text>
        </Pressable>

        {rejectedList.length > 0 && (
          <Pressable
            onPress={() => setFilter("rejected")}
            style={[styles.filterChip, filter === "rejected" && styles.filterChipActive]}
          >
            <Text style={[styles.filterText, filter === "rejected" && styles.filterTextActive]}>
              ውድቅ የተደረጉ ({rejectedList.length})
            </Text>
          </Pressable>
        )}
      </View>

      {/* Contributions List */}
      <View style={styles.list}>
        {displayedList.map((payment) => {
          const badge = getStatusBadge(payment.status);
          const isPending = payment.status === "pending";

          return (
            <View key={payment.id} style={styles.paymentCard}>
              <View style={styles.cardTopRow}>
                <View style={styles.memberInfo}>
                  <Text style={styles.memberName}>{getMemberName(payment.memberId)}</Text>
                  <Text style={styles.paidDate}>
                    {new Date(payment.paidAt).toLocaleString("en-ET", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </View>

                <View style={styles.amountCol}>
                  <Text style={styles.amountText}>{money(payment.amount)}</Text>
                  <View
                    style={[
                      styles.badgePill,
                      { backgroundColor: badge.bg, borderColor: badge.border },
                    ]}
                  >
                    <Text style={[styles.badgeText, { color: badge.text }]}>
                      {badge.label}
                    </Text>
                  </View>
                </View>
              </View>

              {payment.note ? (
                <View style={styles.noteBox}>
                  <Text style={styles.noteLabel}>ማስታወሻ / ማጣቀሻ፦</Text>
                  <Text style={styles.noteText}>{payment.note}</Text>
                </View>
              ) : null}

              {/* Authorized Verification Action Buttons */}
              {isPending && (
                <View style={styles.actionRow}>
                  <Pressable
                    onPress={() => onVerifyPayment(payment, true)}
                    style={({ pressed }) => [styles.verifyBtn, pressed && styles.btnPressed]}
                  >
                    <Text style={styles.verifyBtnText}>✓ {t.verifyBtn}</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => onVerifyPayment(payment, false)}
                    style={({ pressed }) => [styles.rejectBtn, pressed && styles.btnPressed]}
                  >
                    <Text style={styles.rejectBtnText}>{t.rejectBtn}</Text>
                  </Pressable>
                </View>
              )}
            </View>
          );
        })}

        {displayedList.length === 0 && (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>በዚህ ማጣሪያ ምንም ክፍያ አልተገኘም።</Text>
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
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.md,
  },
  pageTitle: {
    color: Palette.midnightNavy,
    fontSize: 20,
    fontWeight: "800",
  },
  pageSubtitle: {
    color: Palette.textSecondary,
    fontSize: 11.5,
    marginTop: 2,
  },
  recordBtn: {
    backgroundColor: Palette.royalBlue,
    borderRadius: Radii.sm,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  recordBtnText: {
    color: Palette.surfaceWhite,
    fontSize: 12,
    fontWeight: "800",
  },
  summaryBox: {
    flexDirection: "row",
    backgroundColor: Palette.surfaceWhite,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Palette.neutralBorder,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    alignItems: "center",
    ...Shadows.subtle,
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
  },
  summaryDivider: {
    width: 1,
    height: 30,
    backgroundColor: Palette.neutralBorder,
  },
  summaryLabel: {
    color: Palette.textSecondary,
    fontSize: 10.5,
    fontWeight: "600",
  },
  summaryValue: {
    color: Palette.midnightNavy,
    fontSize: 13.5,
    fontWeight: "800",
    marginTop: 3,
  },
  noticeContainer: {
    backgroundColor: Palette.royalBlueLight,
    borderLeftWidth: 3,
    borderLeftColor: Palette.royalBlue,
    borderRadius: Radii.xs,
    padding: Spacing.sm,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: Spacing.md,
  },
  noticeIcon: {
    fontSize: 14,
  },
  noticeText: {
    flex: 1,
    color: Palette.midnightNavy,
    fontSize: 11,
    lineHeight: 16,
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  filterChip: {
    backgroundColor: Palette.surfaceWhite,
    borderRadius: Radii.full,
    borderWidth: 1,
    borderColor: Palette.neutralBorder,
    paddingHorizontal: 11,
    paddingVertical: 5,
  },
  filterChipActive: {
    backgroundColor: Palette.midnightNavy,
    borderColor: Palette.midnightNavy,
  },
  filterText: {
    color: Palette.textSecondary,
    fontSize: 11,
    fontWeight: "600",
  },
  filterTextActive: {
    color: Palette.surfaceWhite,
    fontWeight: "800",
  },
  list: {
    gap: Spacing.md,
  },
  paymentCard: {
    backgroundColor: Palette.surfaceWhite,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Palette.neutralBorder,
    padding: Spacing.md,
    ...Shadows.subtle,
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    color: Palette.midnightNavy,
    fontSize: 14,
    fontWeight: "800",
  },
  paidDate: {
    color: Palette.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  amountCol: {
    alignItems: "flex-end",
    gap: 3,
  },
  amountText: {
    color: Palette.midnightNavy,
    fontSize: 15,
    fontWeight: "800",
  },
  badgePill: {
    borderWidth: 1,
    borderRadius: Radii.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 9.5,
    fontWeight: "800",
  },
  noteBox: {
    backgroundColor: Palette.neutralSurface,
    borderRadius: Radii.xs,
    padding: Spacing.sm,
    marginTop: Spacing.sm,
  },
  noteLabel: {
    color: Palette.textMuted,
    fontSize: 9.5,
    fontWeight: "700",
  },
  noteText: {
    color: Palette.midnightNavy,
    fontSize: 11,
    marginTop: 1,
  },
  actionRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginTop: Spacing.md,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Palette.neutralDivider,
  },
  verifyBtn: {
    backgroundColor: Palette.confirmedGreen,
    borderRadius: Radii.sm,
    paddingVertical: 8,
    paddingHorizontal: 14,
    flex: 1,
    alignItems: "center",
  },
  verifyBtnText: {
    color: Palette.surfaceWhite,
    fontSize: 11.5,
    fontWeight: "800",
  },
  rejectBtn: {
    backgroundColor: Palette.neutralSurface,
    borderWidth: 1,
    borderColor: Palette.rejectedRedBorder,
    borderRadius: Radii.sm,
    paddingVertical: 8,
    paddingHorizontal: 14,
    alignItems: "center",
  },
  rejectBtnText: {
    color: Palette.rejectedRed,
    fontSize: 11.5,
    fontWeight: "700",
  },
  emptyCard: {
    backgroundColor: Palette.surfaceWhite,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: Palette.neutralBorder,
    padding: Spacing.xl,
    alignItems: "center",
  },
  emptyText: {
    color: Palette.textMuted,
    fontSize: 13,
  },
  btnPressed: {
    opacity: 0.85,
  },
});
