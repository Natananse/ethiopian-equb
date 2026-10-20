import { useState } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { AppButton, Card, Notice, Screen } from "@/components/ui";
import { currentRotationNumber, eligibleDrawMembers, membersWithIdentityIssues, type DrawRecord } from "@/core/engine";
import { useTranslation } from "@/core/i18n";
import { selectActiveCycle, useEqubStore } from "@/store";
import { radius, spacing, useTheme } from "@/theme";

export function DrawScreen() {
  const { colors } = useTheme();
  const { t, language } = useTranslation();
  const data = useEqubStore((state) => state.data);
  const drawWinner = useEqubStore((state) => state.drawWinner);
  const advanceCycle = useEqubStore((state) => state.advanceCycle);
  const startNextRotation = useEqubStore((state) => state.startNextRotation);
  const [drawing, setDrawing] = useState(false);
  const [showAllEligible, setShowAllEligible] = useState(false);

  const cycle = selectActiveCycle(data);
  const rotation = currentRotationNumber(data);
  const activeMembers = data.members.filter((member) => member.status === "active");
  const draws = data.draws ?? [];
  const eligible = cycle ? eligibleDrawMembers(data, rotation, cycle.id) : [];
  const identityIssueMembers = cycle ? membersWithIdentityIssues(data, cycle.id) : [];
  const currentCycleDraw = cycle ? draws.find((record) => record.cycleId === cycle.id) : undefined;
  const winnersCount = draws.filter((record) => record.rotationNumber === rotation).length;
  const history = [...draws].sort((a, b) => b.drawnAt.localeCompare(a.drawnAt)).slice(0, 12);
  const visibleEligible = showAllEligible ? eligible : eligible.slice(0, 5);
  const locale = language === "am" ? "am-ET" : "en-ET";

  const showError = (title: string, error: unknown) => {
    Alert.alert(title, error instanceof Error ? error.message : String(error));
  };

  const draw = () => {
    setDrawing(true);
    setTimeout(() => {
      try {
        drawWinner();
      } catch (error) {
        showError(t.drawTitle, error);
      } finally {
        setDrawing(false);
      }
    }, 450);
  };

  const openNextCycle = () => {
    try {
      advanceCycle();
    } catch (error) {
      showError(t.nextCycle, error);
    }
  };

  const openNextRotation = () => {
    try {
      startNextRotation();
    } catch (error) {
      showError(t.nextRotation, error);
    }
  };

  const memberForDraw = (record: DrawRecord) => data.members.find((member) => member.id === record.winnerMemberId);

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heading}>
          <Text style={[styles.title, { color: colors.text }]}>{t.drawTitle}</Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>{t.drawIntro}</Text>
        </View>

        <Card style={styles.cycleCard}>
          <View style={styles.cycleHeader}>
            <View style={[styles.cycleMark, { backgroundColor: colors.surfaceAlt }]}>
              <Ionicons name="sparkles-outline" size={24} color={colors.primary} />
            </View>
            <View style={styles.cycleInfo}>
              <Text style={[styles.eyebrow, { color: colors.primary }]}>{t.activeCycle}</Text>
              <Text style={[styles.cycleTitle, { color: colors.text }]}>{cycle?.label ?? t.noActiveCycle}</Text>
            </View>
            <View style={[styles.rotationPill, { backgroundColor: colors.surfaceAlt }]}>
              <Text style={[styles.rotationText, { color: colors.primary }]}>{t.rotation} {rotation}</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>{eligible.length}</Text>
              <Text style={[styles.statLabel, { color: colors.muted }]}>{t.eligibleMembers}</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.stat}>
              <Text style={[styles.statNumber, { color: colors.success }]}>{winnersCount}</Text>
              <Text style={[styles.statLabel, { color: colors.muted }]}>{t.winnersThisRotation}</Text>
            </View>
          </View>

          {currentCycleDraw ? (
            <>
            <View style={[styles.winnerPanel, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
              <Text style={[styles.eyebrow, { color: colors.primary }]}>{t.winner}</Text>
              <Text style={[styles.winnerName, { color: colors.text }]}>
                {currentCycleDraw.winnerName || memberForDraw(currentCycleDraw)?.name || t.noIdentity}
              </Text>
              <Text style={[styles.winnerDetails, { color: colors.muted }]}>
                {t.customerNumber}: {currentCycleDraw.winnerCustomerNumber || memberForDraw(currentCycleDraw)?.customerNumber || t.noIdentity}
              </Text>
              <Text style={[styles.winnerDetails, { color: colors.muted }]}>
                {t.idNumber}: {currentCycleDraw.winnerIdNumber || memberForDraw(currentCycleDraw)?.idNumber || t.noIdentity}
              </Text>
              <Text style={[styles.winnerDetails, { color: colors.muted }]}>
                {t.sequence}: {currentCycleDraw.sequenceNumber} · {new Date(currentCycleDraw.drawnAt).toLocaleDateString(locale)}
              </Text>
            </View>
            <Notice>{t.newCycleNotice}</Notice>
            </>
          ) : (
            <>
              <Text style={[styles.prompt, { color: colors.muted }]}>{t.drawPrompt}</Text>
              {activeMembers.length === 0 ? (
                <Notice>{t.noActiveMembers}</Notice>
              ) : cycle && eligible.length === 0 && identityIssueMembers.length === 0 ? (
                <Notice>{t.rotationComplete}</Notice>
              ) : null}
              <AppButton
                label={drawing ? t.drawing : t.drawNow}
                onPress={draw}
                disabled={drawing || !cycle || eligible.length === 0 || identityIssueMembers.length > 0}
              />
              {drawing ? <ActivityIndicator color={colors.primary} /> : null}
            </>
          )}
        </Card>

        {currentCycleDraw ? (
          eligible.length > 0 ? (
            <AppButton label={t.nextCycle} onPress={openNextCycle} />
          ) : activeMembers.length > 0 ? (
            <View style={styles.rotationActions}>
              <Notice>{t.nextRotationNotice}</Notice>
              <AppButton label={t.nextRotation} onPress={openNextRotation} />
            </View>
          ) : null
        ) : null}

        {identityIssueMembers.length > 0 ? (
          <View style={styles.rotationActions}>
            <Notice>{`${t.identityIncomplete} (${identityIssueMembers.length})`}</Notice>
            <AppButton label={t.goToMembers} onPress={() => router.push("/members")} secondary />
          </View>
        ) : null}

        <Card style={styles.poolCard}>
          <View style={styles.poolHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t.eligiblePool}</Text>
            <Text style={[styles.poolCount, { color: colors.primary }]}>{eligible.length}</Text>
          </View>
          {eligible.length === 0 ? (
            <Text style={[styles.emptyText, { color: colors.muted }]}>{t.noEligibleMembers}</Text>
          ) : (
            visibleEligible.map((member) => (
              <View key={member.id} style={[styles.poolRow, { borderTopColor: colors.border }]}>
                <View style={styles.poolMember}>
                  <Text style={[styles.historyName, { color: colors.text }]}>{member.name}</Text>
                  <Text style={[styles.historyMeta, { color: colors.muted }]}>
                    {t.customerNumber}: {member.customerNumber ?? t.noIdentity} · {t.idNumber}: {member.idNumber ?? t.noIdentity}
                  </Text>
                </View>
                <Text style={[styles.eligibleBadge, { color: colors.success }]}>{t.eligibleTag}</Text>
              </View>
            ))
          )}
          {eligible.length > 5 ? (
            <Pressable onPress={() => setShowAllEligible((value) => !value)} accessibilityRole="button">
              <Text style={[styles.expandLabel, { color: colors.primary }]}>
                {showAllEligible ? t.showLess : `${t.showMore} (${eligible.length - 5})`}
              </Text>
            </Pressable>
          ) : null}
        </Card>

        <View style={styles.historyHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t.drawHistory}</Text>
          <Text style={[styles.historyCount, { color: colors.muted }]}>{draws.length}</Text>
        </View>

        {history.length === 0 ? (
          <Card>
            <Text style={[styles.emptyText, { color: colors.muted }]}>{t.noDrawHistory}</Text>
          </Card>
        ) : (
          history.map((record) => {
            const member = memberForDraw(record);
            const cycleLabel = data.cycles.find((item) => item.id === record.cycleId)?.label ?? record.cycleId;
            return (
              <Card key={record.id} style={styles.historyCard}>
                <View style={[styles.historyBadge, { backgroundColor: colors.surfaceAlt }]}>
                  <Text style={[styles.historyBadgeText, { color: colors.primary }]}>{record.sequenceNumber}</Text>
                </View>
                <View style={styles.historyMain}>
                  <Text style={[styles.historyName, { color: colors.text }]}>{record.winnerName || member?.name || t.noIdentity}</Text>
                  <Text style={[styles.historyMeta, { color: colors.muted }]}>
                    {t.customerNumber}: {record.winnerCustomerNumber || member?.customerNumber || t.noIdentity} · {t.idNumber}: {record.winnerIdNumber || member?.idNumber || t.noIdentity}
                  </Text>
                  <Text style={[styles.historyMeta, { color: colors.muted }]}>
                    {cycleLabel} · {t.rotation} {record.rotationNumber} · {new Date(record.drawnAt).toLocaleDateString(locale)}
                  </Text>
                </View>
              </Card>
            );
          })
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, paddingBottom: 34, gap: spacing.md },
  heading: { gap: spacing.xs, marginBottom: spacing.xs },
  title: { fontSize: 23, fontWeight: "900" },
  subtitle: { fontSize: 12, lineHeight: 18 },
  cycleCard: { gap: spacing.md },
  poolCard: { gap: spacing.sm },
  cycleHeader: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  cycleMark: { width: 42, height: 42, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  cycleInfo: { flex: 1, gap: 2 },
  eyebrow: { fontSize: 10, fontWeight: "800", letterSpacing: 1 },
  cycleTitle: { fontSize: 16, fontWeight: "800" },
  rotationPill: { borderRadius: radius.pill, paddingVertical: 7, paddingHorizontal: 10 },
  rotationText: { fontSize: 10, fontWeight: "800" },
  statsRow: { flexDirection: "row", alignItems: "center", paddingVertical: spacing.sm },
  stat: { flex: 1, alignItems: "center", gap: 4 },
  statNumber: { fontSize: 27, fontWeight: "900" },
  statLabel: { fontSize: 10, fontWeight: "700", textAlign: "center" },
  statDivider: { width: 1, height: 38 },
  prompt: { fontSize: 12, lineHeight: 18 },
  winnerPanel: { borderRadius: radius.md, borderWidth: 1, padding: spacing.md, gap: 4 },
  winnerName: { fontSize: 21, fontWeight: "900", marginTop: 2 },
  winnerDetails: { fontSize: 11, lineHeight: 16 },
  rotationActions: { gap: spacing.sm },
  historyHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: spacing.sm },
  sectionTitle: { fontSize: 16, fontWeight: "900" },
  historyCount: { fontSize: 12, fontWeight: "800" },
  emptyText: { fontSize: 12 },
  poolHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  poolCount: { fontSize: 18, fontWeight: "900" },
  poolRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm, borderTopWidth: 1, paddingTop: spacing.sm },
  poolMember: { flex: 1, gap: 3 },
  eligibleBadge: { fontSize: 9, fontWeight: "800" },
  expandLabel: { fontSize: 11, fontWeight: "800", paddingVertical: spacing.xs },
  historyCard: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  historyBadge: { width: 34, height: 34, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  historyBadgeText: { fontSize: 12, fontWeight: "900" },
  historyMain: { flex: 1, gap: 3 },
  historyName: { fontSize: 13, fontWeight: "800" },
  historyMeta: { fontSize: 10, lineHeight: 15 },
});
