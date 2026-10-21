import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { Member } from "@/core/engine";
import { useTranslation } from "@/core/i18n";
import { radius, useTheme } from "@/theme";

interface Props {
  member: Member;
  /** Whether the member has a confirmed contribution for the active cycle. */
  paid: boolean;
  /** Amount to show on the right: the confirmed amount, or the expected contribution. */
  amountLabel: string;
  onEdit?: () => void;
  identityIssue: boolean;
  roleLabel?: string;
  onRoleChange?: () => void;
}

export function MemberRow({ member, paid, amountLabel, onEdit, identityIssue, roleLabel, onRoleChange }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  return (
    <View style={[styles.row, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={[styles.avatar, { backgroundColor: colors.surfaceAlt }]}>
        <Text style={[styles.avatarText, { color: colors.primary }]}>{member.name.slice(0, 1)}</Text>
      </View>
      <View style={styles.main}>
        <Text style={[styles.name, { color: colors.text }]}>{member.name}</Text>
        <Text style={[styles.meta, { color: colors.muted }]}>
          {t.customerNumber}: {member.customerNumber ?? t.noIdentity}
        </Text>
        <Text style={[styles.meta, { color: colors.muted }]}>
          {t.idNumber}: {member.idNumber ?? t.noIdentity}{member.phone ? ` · ${member.phone}` : ""}
        </Text>
        {onEdit ? (
          <Pressable onPress={onEdit} accessibilityRole="button" accessibilityLabel={t.edit} hitSlop={8} style={styles.editButton}>
            <Text style={[styles.edit, { color: colors.primary }]}>{t.edit}</Text>
            <Ionicons name="create-outline" size={14} color={colors.primary} />
          </Pressable>
        ) : null}
        {onRoleChange ? (
          <Pressable onPress={onRoleChange} accessibilityRole="button" hitSlop={8} style={styles.editButton}>
            <Text style={[styles.edit, { color: colors.primary }]}>{roleLabel}</Text>
            <Ionicons name="shield-outline" size={14} color={colors.primary} />
          </Pressable>
        ) : null}
        {identityIssue ? <Text style={[styles.issue, { color: colors.danger }]}>{t.identityIssueTag}</Text> : null}
      </View>
      <View style={styles.right}>
        <View style={[styles.statusPill, { backgroundColor: paid ? colors.noticeBackground : colors.surfaceAlt }]}>
          <View style={[styles.statusDot, { backgroundColor: paid ? colors.success : colors.accent }]} />
          <Text style={[styles.status, { color: paid ? colors.success : colors.muted }]}>
          {paid ? t.confirmed : t.outstanding}
          </Text>
        </View>
        <Text style={[styles.meta, { color: colors.muted }]}>{amountLabel}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    borderRadius: radius.md,
    padding: 14,
    borderWidth: StyleSheet.hairlineWidth,
  },
  avatar: { width: 44, height: 44, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  avatarText: { fontSize: 18, fontWeight: "800" },
  main: { flex: 1, minWidth: 0 },
  name: { fontWeight: "800", fontSize: 14 },
  meta: { fontSize: 11, marginTop: 4 },
  editButton: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 8, alignSelf: "flex-start" },
  edit: { fontSize: 11, fontWeight: "700" },
  issue: { fontSize: 9, fontWeight: "800", marginTop: 3 },
  right: { alignItems: "flex-end", gap: 6 },
  statusPill: { flexDirection: "row", alignItems: "center", gap: 5, borderRadius: radius.pill, paddingHorizontal: 8, paddingVertical: 5 },
  statusDot: { width: 6, height: 6, borderRadius: 4 },
  status: { fontWeight: "700", fontSize: 10 },
});
