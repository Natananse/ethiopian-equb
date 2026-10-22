import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Pressable,
} from "react-native";
import { Palette, Radii, Shadows, Spacing } from "../theme/theme";
import type { Translations } from "../i18n/translations";
import { money, type EqubState, type Member } from "../engine/engine";

interface MembersViewProps {
  t: Translations;
  state: EqubState;
  activeCycleId: string;
  onAddMember: () => void;
}

export const MembersView: React.FC<MembersViewProps> = ({
  t,
  state,
  activeCycleId,
  onAddMember,
}) => {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "paid" | "unpaid">("all");

  const paidMemberIds = new Set(
    state.contributions
      .filter((c) => c.cycleId === activeCycleId && c.status === "confirmed")
      .map((c) => c.memberId)
  );

  const pendingMemberIds = new Set(
    state.contributions
      .filter((c) => c.cycleId === activeCycleId && c.status === "pending")
      .map((c) => c.memberId)
  );

  const filtered = state.members.filter((m) => {
    const matchesQuery =
      m.name.toLowerCase().includes(query.toLowerCase()) ||
      m.phone.includes(query);
    const isPaid = paidMemberIds.has(m.id);
    if (filter === "paid") return matchesQuery && isPaid;
    if (filter === "unpaid") return matchesQuery && !isPaid;
    return matchesQuery;
  });

  const totalMembers = state.members.length;
  const paidCount = paidMemberIds.size;
  const unpaidCount = totalMembers - paidCount;

  return (
    <ScrollView contentContainerStyle={styles.content}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.pageTitle}>{t.membersTitle}</Text>
          <Text style={styles.pageSubtitle}>
            {totalMembers} አባላት • {paidCount} ከፍለዋል • {unpaidCount} ቀሪ
          </Text>
        </View>

        <Pressable
          onPress={onAddMember}
          style={({ pressed }) => [styles.addBtn, pressed && styles.btnPressed]}
        >
          <Text style={styles.addBtnText}>＋ {t.addMemberBtn}</Text>
        </Pressable>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>⌕</Text>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={t.searchMembersPlaceholder}
          placeholderTextColor={Palette.textMuted}
          style={styles.searchInput}
        />
        {query.length > 0 && (
          <Pressable onPress={() => setQuery("")} style={styles.clearBtn}>
            <Text style={styles.clearText}>✕</Text>
          </Pressable>
        )}
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        <Pressable
          onPress={() => setFilter("all")}
          style={[styles.filterChip, filter === "all" && styles.filterChipActive]}
        >
          <Text style={[styles.filterText, filter === "all" && styles.filterTextActive]}>
            ሁሉም ({totalMembers})
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setFilter("paid")}
          style={[styles.filterChip, filter === "paid" && styles.filterChipActive]}
        >
          <Text style={[styles.filterText, filter === "paid" && styles.filterTextActive]}>
            የከፈሉ ({paidCount})
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setFilter("unpaid")}
          style={[styles.filterChip, filter === "unpaid" && styles.filterChipActive]}
        >
          <Text style={[styles.filterText, filter === "unpaid" && styles.filterTextActive]}>
            ያልከፈሉ ({unpaidCount})
          </Text>
        </Pressable>
      </View>

      {/* Members List */}
      <View style={styles.list}>
        {filtered.map((m, index) => {
          const isPaid = paidMemberIds.has(m.id);
          const isPending = pendingMemberIds.has(m.id);

          return (
            <View key={m.id} style={styles.memberCard}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{m.name.slice(0, 1)}</Text>
              </View>

              <View style={styles.infoCol}>
                <View style={styles.nameRow}>
                  <Text style={styles.memberName}>{m.name}</Text>
                  <View style={styles.orderBadge}>
                    <Text style={styles.orderBadgeText}>#{index + 1}</Text>
                  </View>
                </View>
                <Text style={styles.memberPhone}>{m.phone}</Text>
              </View>

              <View style={styles.statusCol}>
                {isPaid ? (
                  <View style={styles.paidBadge}>
                    <Text style={styles.paidBadgeText}>✓ {t.statusConfirmed}</Text>
                  </View>
                ) : isPending ? (
                  <View style={styles.pendingBadge}>
                    <Text style={styles.pendingBadgeText}>⏳ {t.statusPending}</Text>
                  </View>
                ) : (
                  <View style={styles.unpaidBadge}>
                    <Text style={styles.unpaidBadgeText}>{t.statusUnpaid}</Text>
                  </View>
                )}
                <Text style={styles.amountHint}>
                  {money(state.contributionAmount)}
                </Text>
              </View>
            </View>
          );
        })}

        {filtered.length === 0 && (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>{t.noMembersFound}</Text>
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
  addBtn: {
    backgroundColor: Palette.royalBlue,
    borderRadius: Radii.sm,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  addBtnText: {
    color: Palette.surfaceWhite,
    fontSize: 12,
    fontWeight: "800",
  },
  searchContainer: {
    backgroundColor: Palette.surfaceWhite,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: Palette.neutralBorder,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadows.subtle,
  },
  searchIcon: {
    color: Palette.textMuted,
    fontSize: 18,
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 13,
    color: Palette.midnightNavy,
  },
  clearBtn: {
    padding: 6,
  },
  clearText: {
    color: Palette.textMuted,
    fontSize: 12,
  },
  filterRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  filterChip: {
    backgroundColor: Palette.surfaceWhite,
    borderRadius: Radii.full,
    borderWidth: 1,
    borderColor: Palette.neutralBorder,
    paddingHorizontal: 12,
    paddingVertical: 6,
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
    gap: Spacing.sm,
  },
  memberCard: {
    backgroundColor: Palette.surfaceWhite,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: Palette.neutralBorder,
    padding: Spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    ...Shadows.subtle,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: Radii.sm,
    backgroundColor: Palette.neutralSurface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Palette.neutralBorder,
  },
  avatarText: {
    color: Palette.midnightNavy,
    fontSize: 16,
    fontWeight: "800",
  },
  infoCol: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  memberName: {
    color: Palette.midnightNavy,
    fontSize: 13.5,
    fontWeight: "700",
  },
  orderBadge: {
    backgroundColor: Palette.neutralSurface,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: Radii.xs,
  },
  orderBadgeText: {
    color: Palette.textMuted,
    fontSize: 9.5,
    fontWeight: "700",
  },
  memberPhone: {
    color: Palette.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  statusCol: {
    alignItems: "flex-end",
    gap: 2,
  },
  paidBadge: {
    backgroundColor: Palette.confirmedGreenSurface,
    borderColor: Palette.confirmedGreenBorder,
    borderWidth: 1,
    borderRadius: Radii.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  paidBadgeText: {
    color: Palette.confirmedGreen,
    fontSize: 9.5,
    fontWeight: "800",
  },
  pendingBadge: {
    backgroundColor: Palette.pendingAmberSurface,
    borderColor: Palette.pendingAmberBorder,
    borderWidth: 1,
    borderRadius: Radii.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  pendingBadgeText: {
    color: Palette.pendingAmber,
    fontSize: 9.5,
    fontWeight: "800",
  },
  unpaidBadge: {
    backgroundColor: Palette.neutralSurface,
    borderColor: Palette.neutralBorder,
    borderWidth: 1,
    borderRadius: Radii.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  unpaidBadgeText: {
    color: Palette.textMuted,
    fontSize: 9.5,
    fontWeight: "700",
  },
  amountHint: {
    color: Palette.textMuted,
    fontSize: 10,
    marginTop: 1,
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
