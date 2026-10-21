import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { AppButton, AppTextInput, Notice, Screen } from "@/components/ui";
import { membersWithIdentityIssues, money } from "@/core/engine";
import { useTranslation } from "@/core/i18n";
import { selectActiveCycle, selectConfirmedContribution, useEqubStore } from "@/store";
import { spacing, useTheme } from "@/theme";
import { MemberRow } from "../components/MemberRow";

export function MembersScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const data = useEqubStore((s) => s.data);
  const [query, setQuery] = useState("");

  const cycleId = selectActiveCycle(data)?.id ?? "";
  const identityIssueMembers = membersWithIdentityIssues(data);
  const identityIncompleteCount = identityIssueMembers.length;
  const identityIssueIds = new Set(identityIssueMembers.map((member) => member.id));
  const filtered = useMemo(
    () => data.members.filter((m) => `${m.name} ${m.customerNumber ?? ""} ${m.idNumber ?? ""} ${m.phone}`.toLowerCase().includes(query.toLowerCase())),
    [data.members, query]
  );

  return (
    <Screen>
      <FlatList
        contentContainerStyle={styles.content}
        data={filtered}
        keyExtractor={(m) => m.id}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <View style={styles.titleBlock}>
                <Text style={[styles.pageTitle, { color: colors.text }]}>{t.allMembers}</Text>
                <Text style={[styles.subtitle, { color: colors.muted }]}>{`${data.members.length} ${t.memberCount.toLowerCase()}`}</Text>
              </View>
              <View style={styles.addButton}>
                <AppButton label={t.add} icon="add" onPress={() => router.push("/add-member")} />
              </View>
            </View>
            <View style={[styles.search, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Ionicons name="search-outline" size={19} color={colors.muted} />
              <AppTextInput
                value={query}
                onChangeText={setQuery}
                placeholder={t.search}
                style={styles.searchInput}
              />
            </View>
            {identityIncompleteCount > 0 ? (
              <Notice>{`${t.identityIncomplete} (${identityIncompleteCount})`}</Notice>
            ) : null}
          </View>
        }
        ListEmptyComponent={
          <View style={[styles.empty, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name="people-outline" size={27} color={colors.primary} />
            <Text style={[styles.emptyText, { color: colors.text }]}>{t.noMembers}</Text>
          </View>
        }
        renderItem={({ item }) => {
          const confirmed = selectConfirmedContribution(data, item.id, cycleId);
          return (
            <MemberRow
              member={item}
              paid={Boolean(confirmed)}
              amountLabel={money(confirmed?.amount ?? data.contributionAmount)}
              onEdit={() => router.push({ pathname: "/edit-member", params: { memberId: item.id } })}
              identityIssue={identityIssueIds.has(item.id)}
            />
          );
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, paddingBottom: 40, gap: spacing.md },
  header: { gap: spacing.md, marginBottom: spacing.sm },
  titleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 10 },
  titleBlock: { flex: 1, gap: 4 },
  pageTitle: { fontSize: 25, fontWeight: "800" },
  subtitle: { fontSize: 12 },
  addButton: { minWidth: 98 },
  search: { flexDirection: "row", alignItems: "center", gap: 10, borderRadius: 17, borderWidth: StyleSheet.hairlineWidth, paddingHorizontal: 13 },
  searchInput: { flex: 1, borderWidth: 0, marginTop: 0, paddingHorizontal: 0, backgroundColor: "transparent" },
  empty: { borderWidth: StyleSheet.hairlineWidth, borderRadius: 20, minHeight: 150, alignItems: "center", justifyContent: "center", gap: 10, padding: 18 },
  emptyText: { fontSize: 13, fontWeight: "600" },
});
