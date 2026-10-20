import { router } from "expo-router";
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

  const cycle = selectActiveCycle(data);
  const cycleId = cycle?.id ?? "";
  const metrics = selectCycleMetrics(data, cycleId);
  const nextPayout = data.payouts.find((p) => p.status === "scheduled" || p.status === "pending_approval");
  const recent = data.contributions.slice(-5).reverse();

  const quickActions: { label: string; icon: string; onPress: () => void }[] = [
    { label: t.drawLottery, icon: "✦", onPress: () => router.push("/draw") },
    { label: t.addMember, icon: "＋", onPress: () => router.push("/add-member") },
    { label: t.recordPayment, icon: "◫", onPress: () => router.push("/record-payment") },
    { label: t.members, icon: "⌕", onPress: () => router.push("/members") },
    { label: t.payouts, icon: "▣", onPress: () => router.push("/payouts") },
  ];

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <Card>
          <Text style={[styles.eyebrow, { color: colors.primary }]}>{t.activeCycle}</Text>
          <Text style={[styles.heroTitle, { color: colors.text }]}>{data.groupName}</Text>
          <Text style={[styles.heroSub, { color: colors.muted }]}>
            {cycle ? `${cycle.label} · ${money(cycle.contributionAmount)}` : t.noActiveCycle}
          </Text>
          <View style={styles.progressHeader}>
            <Text style={[styles.progressLabel, { color: colors.muted }]}>{t.progress}</Text>
            <Text style={[styles.progressNumber, { color: colors.primary }]}>{metrics.progress}%</Text>
          </View>
          <ProgressBar progress={metrics.progress} />
        </Card>

        <View style={styles.grid}>
          <MetricCard label={t.expected} value={money(metrics.expected)} color={colors.text} />
          <MetricCard label={t.collected} value={money(metrics.collected)} color={colors.success} />
          <MetricCard label={t.outstanding} value={money(metrics.outstanding)} color={colors.primary} />
          <MetricCard
            label={t.paid}
            value={`${metrics.paidCount} / ${cycle?.participantMemberIds?.length ?? data.members.filter((m) => m.status === "active").length}`}
            color={colors.text}
          />
        </View>

        {nextPayout ? (
          <Card>
            <Text style={[styles.eyebrow, { color: colors.primary }]}>{t.nextPayout}</Text>
            <Text style={[styles.payoutValue, { color: colors.text }]}>{money(nextPayout.netAmount)}</Text>
            <Text style={[styles.heroSub, { color: colors.muted }]}>{memberName(data, nextPayout.recipientMemberId)}</Text>
          </Card>
        ) : null}

        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t.quickActions}</Text>
        <View style={styles.quickGrid}>
          {quickActions.map((item) => (
            <Pressable
              key={item.label}
              onPress={item.onPress}
              style={[styles.quickItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
            >
              <Text style={[styles.quickIcon, { color: colors.primary }]}>{item.icon}</Text>
              <Text style={[styles.quickLabel, { color: colors.text }]}>{item.label}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t.recentPayments}</Text>
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
  content: { padding: spacing.lg, paddingBottom: 30, gap: spacing.md },
  eyebrow: { fontSize: 10, fontWeight: "800", letterSpacing: 1.4 },
  heroTitle: { fontSize: 24, fontWeight: "800", marginTop: 8 },
  heroSub: { fontSize: 12, marginTop: 5 },
  progressHeader: { flexDirection: "row", justifyContent: "space-between", marginTop: 22, marginBottom: 8 },
  progressLabel: { fontSize: 12 },
  progressNumber: { fontWeight: "800" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  payoutValue: { fontSize: 22, fontWeight: "900", marginTop: 6 },
  sectionTitle: { fontSize: 16, fontWeight: "800", marginTop: 8, marginBottom: 2 },
  quickGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  quickItem: {
    flexGrow: 1,
    flexBasis: "46%",
    minWidth: 135,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.lg - 2,
    gap: 8,
  },
  quickIcon: { fontSize: 20, fontWeight: "800" },
  quickLabel: { fontSize: 13, fontWeight: "700" },
});
