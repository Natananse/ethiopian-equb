import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Palette, Radii, Shadows, Spacing, Typography } from "../theme/theme";
import type { Translations } from "../i18n/translations";
import { money, type Contribution, type Payout } from "../engine/engine";

interface RecentActivityListProps {
  t: Translations;
  contributions: Contribution[];
  payouts: Payout[];
  getMemberName: (id: string) => string;
}

export const RecentActivityList: React.FC<RecentActivityListProps> = ({
  t,
  contributions,
  payouts,
  getMemberName,
}) => {
  // Combine contributions and payouts into chronological events
  const events = React.useMemo(() => {
    const list: Array<{
      id: string;
      title: string;
      subtitle: string;
      amount: number;
      status: string;
      timestamp: string;
      type: "contribution" | "payout";
    }> = [];

    // Latest 5 contributions
    contributions.slice(-5).reverse().forEach((c) => {
      const name = getMemberName(c.memberId);
      list.push({
        id: c.id,
        title: `${name} — የክፍያ መዝገብ`,
        subtitle: c.note || "መደበኛ የዕቁብ ክፍያ",
        amount: c.amount,
        status: c.status,
        timestamp: new Date(c.paidAt).toLocaleDateString("en-ET", {
          month: "short",
          day: "numeric",
        }),
        type: "contribution",
      });
    });

    // Payout milestones
    payouts.forEach((p) => {
      const name = getMemberName(p.recipientMemberId);
      list.push({
        id: p.id,
        title: `${name} — የዕቁብ ምደባ`,
        subtitle: p.evidenceNote || "ወርሃዊ የዕጣ ምደባ",
        amount: p.netAmount,
        status: p.status,
        timestamp: "በዚህ ዙር",
        type: "payout",
      });
    });

    return list.slice(0, 5);
  }, [contributions, payouts, getMemberName]);

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "confirmed":
      case "paid":
        return {
          bg: Palette.confirmedGreenSurface,
          border: Palette.confirmedGreenBorder,
          text: Palette.confirmedGreen,
          label: t.statusConfirmed,
        };
      case "pending":
      case "pending_approval":
        return {
          bg: Palette.pendingAmberSurface,
          border: Palette.pendingAmberBorder,
          text: Palette.pendingAmber,
          label: t.statusPending,
        };
      case "rejected":
      case "blocked":
        return {
          bg: Palette.rejectedRedSurface,
          border: Palette.rejectedRedBorder,
          text: Palette.rejectedRed,
          label: t.statusRejected,
        };
      case "scheduled":
        return {
          bg: Palette.royalBlueLight,
          border: "#C7DBFA",
          text: Palette.royalBlue,
          label: t.statusScheduled,
        };
      default:
        return {
          bg: Palette.neutralSurface,
          border: Palette.neutralBorder,
          text: Palette.textSecondary,
          label: status,
        };
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{t.recentActivityTitle}</Text>

      {events.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>{t.noRecentActivity}</Text>
        </View>
      ) : (
        <View style={styles.listCard}>
          {events.map((event, index) => {
            const badge = getStatusBadgeStyle(event.status);
            const isLast = index === events.length - 1;

            return (
              <View key={event.id}>
                <View style={styles.row}>
                  {/* Event Type Icon Indicator */}
                  <View
                    style={[
                      styles.iconCircle,
                      event.type === "payout"
                        ? styles.payoutIconCircle
                        : styles.contribIconCircle,
                    ]}
                  >
                    <Text style={styles.iconSymbol}>
                      {event.type === "payout" ? "★" : "↓"}
                    </Text>
                  </View>

                  {/* Main Details */}
                  <View style={styles.mainCol}>
                    <Text style={styles.rowTitle} numberOfLines={1}>
                      {event.title}
                    </Text>
                    <Text style={styles.rowSub} numberOfLines={1}>
                      {event.timestamp} • {event.subtitle}
                    </Text>
                  </View>

                  {/* Amount & Status Badge */}
                  <View style={styles.rightCol}>
                    <Text style={styles.amountText}>{money(event.amount)}</Text>
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

                {!isLast && <View style={styles.rowDivider} />}
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  sectionTitle: {
    color: Palette.midnightNavy,
    fontSize: 15,
    fontWeight: "800",
    marginBottom: Spacing.sm,
  },
  listCard: {
    backgroundColor: Palette.surfaceWhite,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Palette.neutralBorder,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    ...Shadows.subtle,
  },
  emptyCard: {
    backgroundColor: Palette.surfaceWhite,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: Palette.neutralBorder,
    padding: Spacing.lg,
    alignItems: "center",
  },
  emptyText: {
    color: Palette.textMuted,
    fontSize: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.sm + 2,
    gap: Spacing.sm + 2,
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: Radii.full,
    alignItems: "center",
    justifyContent: "center",
  },
  contribIconCircle: {
    backgroundColor: Palette.confirmedGreenSurface,
  },
  payoutIconCircle: {
    backgroundColor: Palette.wovenGoldLight,
  },
  iconSymbol: {
    fontSize: 15,
    fontWeight: "800",
    color: Palette.midnightNavy,
  },
  mainCol: {
    flex: 1,
  },
  rowTitle: {
    color: Palette.midnightNavy,
    fontSize: 13,
    fontWeight: "700",
  },
  rowSub: {
    color: Palette.textMuted,
    fontSize: 10.5,
    marginTop: 2,
  },
  rightCol: {
    alignItems: "flex-end",
    gap: 3,
  },
  amountText: {
    color: Palette.midnightNavy,
    fontSize: 13,
    fontWeight: "800",
  },
  badgePill: {
    borderRadius: Radii.full,
    borderWidth: 1,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 9.5,
    fontWeight: "800",
  },
  rowDivider: {
    height: 1,
    backgroundColor: Palette.neutralDivider,
    marginLeft: 46,
  },
});
