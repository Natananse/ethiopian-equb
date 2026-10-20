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
  onEdit: () => void;
  identityIssue: boolean;
}

export function MemberRow({ member, paid, amountLabel, onEdit, identityIssue }: Props) {
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
        <Pressable onPress={onEdit} accessibilityRole="button" hitSlop={8}>
          <Text style={[styles.edit, { color: colors.primary }]}>{t.edit}</Text>
        </Pressable>
        {identityIssue ? <Text style={[styles.issue, { color: colors.danger }]}>{t.identityIssueTag}</Text> : null}
      </View>
      <View style={styles.right}>
        <Text style={[styles.status, { color: paid ? colors.success : colors.accent }]}>
          {paid ? t.confirmed : t.outstanding}
        </Text>
        <Text style={[styles.meta, { color: colors.muted }]}>{amountLabel}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: radius.md,
    padding: 12,
    borderWidth: 1,
  },
  avatar: { width: 38, height: 38, borderRadius: 13, alignItems: "center", justifyContent: "center" },
  avatarText: { fontSize: 17, fontWeight: "900" },
  main: { flex: 1 },
  name: { fontWeight: "700", fontSize: 13 },
  meta: { fontSize: 11, marginTop: 4 },
  edit: { fontSize: 10, fontWeight: "800", marginTop: 7 },
  issue: { fontSize: 9, fontWeight: "800", marginTop: 3 },
  right: { alignItems: "flex-end", gap: 3 },
  status: { fontWeight: "700", fontSize: 11 },
});
