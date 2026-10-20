import { router } from "expo-router";
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
              <Text style={[styles.pageTitle, { color: colors.text }]}>{t.allMembers}</Text>
              <View style={styles.addButton}>
                <AppButton label={t.add} icon="add" onPress={() => router.push("/add-member")} />
              </View>
            </View>
            <AppTextInput value={query} onChangeText={setQuery} placeholder={t.search} />
            {identityIncompleteCount > 0 ? (
              <Notice>{`${t.identityIncomplete} (${identityIncompleteCount})`}</Notice>
            ) : null}
          </View>
        }
        ListEmptyComponent={<Text style={{ color: colors.muted, fontSize: 13 }}>{t.noMembers}</Text>}
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
  content: { padding: spacing.lg, paddingBottom: 30, gap: spacing.md },
  header: { gap: spacing.md, marginBottom: spacing.sm },
  titleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 10 },
  pageTitle: { fontSize: 22, fontWeight: "900", flex: 1 },
  addButton: { minWidth: 110 },
});
