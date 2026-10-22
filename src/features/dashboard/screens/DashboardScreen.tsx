import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Card, MetricCard, ProgressBar, Screen } from "@/components/ui";
import { money } from "@/core/engine";
import { useTranslation } from "@/core/i18n";
import { PaymentCard } from "@/features/payments/components/PaymentCard";
import { memberName, selectActiveCycle, selectCycleMetrics, useEqubStore } from "@/store";
import { radius, spacing, useTheme } from "@/theme";

export function DashboardScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const data = useEqubStore((s) => s.data);
  const role = useEqubStore((s) => s.role);

  const cycle = selectActiveCycle(data);
  const cycleId = cycle?.id ?? "";
  const metrics = selectCycleMetrics(data, cycleId);
  const nextPayout = data.payouts.find((p) => p.status === "scheduled" || p.status === "pending_approval");
  const recent = data.contributions.slice(-5).reverse();

  const quickActions: { label: string; icon: ComponentProps<typeof Ionicons>["name"]; onPress: () => void }[] = [
    ...(role === "admin" ? [
      { label: t.drawLottery, icon: "sparkles-outline" as const, onPress: () => router.push("/draw") },
      { label: t.addMember, icon: "person-add-outline" as const, onPress: () => router.push("/add-member") },
    ] : [{ label: t.drawLottery, icon: "sparkles-outline" as const, onPress: () => router.push("/draw") }]),
    { label: t.recordPayment, icon: "card-outline", onPress: () => router.push("/record-payment") },
    { label: t.members, icon: "people-outline", onPress: () => router.push("/members") },
    { label: t.payouts, icon: "trophy-outline", onPress: () => router.push("/payouts") },
  ];

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={[styles.hero, { backgroundColor: colors.brand, borderColor: colors.brand }]}>
          <View style={styles.cycleTag}>
            <View style={[styles.liveDot, { backgroundColor: colors.accent }]} />
            <Text style={[styles.eyebrow, { color: colors.onBrandMuted }]}>{t.activeCycle}</Text>
          </View>
          <Text style={[styles.heroTitle, { color: colors.onBrand }]}>{data.groupName}</Text>
          <Text style={[styles.heroSub, { color: colors.onBrandMuted }]}>
            {cycle ? `${cycle.label} · ${money(cycle.contributionAmount)}` : t.noActiveCycle}
          </Text>
          <View style={styles.progressHeader}>
            <Text style={[styles.progressLabel, { color: colors.onBrandMuted }]}>{t.progress}</Text>
            <Text style={[styles.progressNumber, { color: colors.accent }]}>{metrics.progress}%</Text>
          </View>
          <ProgressBar progress={metrics.progress} color={colors.accent} trackColor="rgba(255,255,255,0.2)" />
        </Card>

        <View style={styles.grid}>
          <MetricCard label={t.expected} value={money(metrics.expected)} color={colors.text} icon="layers-outline" />
          <MetricCard label={t.collected} value={money(metrics.collected)} color={colors.success} icon="checkmark-circle-outline" />
          <MetricCard label={t.outstanding} value={money(metrics.outstanding)} color={colors.primary} icon="time-outline" />
          <MetricCard
            label={t.paid}
            value={`${metrics.paidCount} / ${cycle?.participantMemberIds?.length ?? data.members.filter((m) => m.status === "active").length}`}
            color={colors.text}
            icon="people-outline"
          />
        </View>

        {nextPayout ? (
          <Card style={styles.payoutCard}>
            <View style={[styles.payoutIcon, { backgroundColor: colors.accent }]}>
              <Ionicons name="gift-outline" size={20} color={colors.brandDeep} />
            </View>
            <View style={styles.payoutInfo}>
              <Text style={[styles.eyebrow, { color: colors.muted }]}>{t.nextPayout}</Text>
              <Text style={[styles.payoutValue, { color: colors.text }]}>{money(nextPayout.netAmount)}</Text>
              <Text style={[styles.heroSub, { color: colors.muted }]}>{memberName(data, nextPayout.recipientMemberId)}</Text>
            </View>
          </Card>
        ) : null}

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t.quickActions}</Text>
          <Ionicons name="grid-outline" size={17} color={colors.muted} />
        </View>
        <View style={styles.quickGrid}>
          {quickActions.map((item) => (
            <Pressable
              key={item.label}
              onPress={item.onPress}
              style={[styles.quickItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
            >
              <View style={[styles.quickIcon, { backgroundColor: colors.surfaceAlt }]}>
                <Ionicons name={item.icon} size={20} color={colors.primary} />
              </View>
              <Text style={[styles.quickLabel, { color: colors.text }]}>{item.label}</Text>
              <Ionicons name="arrow-forward" size={15} color={colors.muted} />
            </Pressable>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t.recentPayments}</Text>
          <Ionicons name="arrow-down-circle-outline" size={18} color={colors.muted} />
        </View>
        {recent.length === 0 ? (
          <Text style={{ color: colors.muted, fontSize: 13 }}>{t.noPayments}</Text>
        ) : (
          recent.map((p) => (
            <PaymentCard
              key={p.id}
              contribution={p}
              memberName={memberName(data, p.memberId)}
              cycleLabel={data.cycles.find((item) => item.id === p.cycleId)?.label ?? p.cycleId}
            />
          ))
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, paddingBottom: 40, gap: spacing.md },
  hero: { padding: spacing.xl, borderRadius: radius.xl, gap: 2 },
  cycleTag: { flexDirection: "row", alignItems: "center", gap: 7 },
  liveDot: { width: 7, height: 7, borderRadius: 5 },
  eyebrow: { fontSize: 10, fontWeight: "800", letterSpacing: 1.1 },
  heroTitle: { fontSize: 25, fontWeight: "800", marginTop: 11 },
  heroSub: { fontSize: 12, marginTop: 5 },
  progressHeader: { flexDirection: "row", justifyContent: "space-between", marginTop: 19, marginBottom: 9 },
  progressLabel: { fontSize: 12 },
  progressNumber: { fontWeight: "800" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  payoutCard: { flexDirection: "row", alignItems: "center", gap: 14 },
  payoutIcon: { width: 44, height: 44, borderRadius: 15, alignItems: "center", justifyContent: "center" },
  payoutInfo: { flex: 1 },
  payoutValue: { fontSize: 22, fontWeight: "900", marginTop: 5 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 },
  sectionTitle: { fontSize: 16, fontWeight: "800" },
  quickGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  quickItem: {
    flexGrow: 1,
    flexBasis: "30%",
    minWidth: 105,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: 8,
    minHeight: 112,
    justifyContent: "space-between",
  },
  quickIcon: { width: 38, height: 38, borderRadius: 13, alignItems: "center", justifyContent: "center" },
  quickLabel: { fontSize: 13, fontWeight: "700" },
});
