import { StyleSheet, Text, View } from "react-native";
import type { Member } from "@/core/engine";
import { useTranslation } from "@/core/i18n";
import { radius, useTheme } from "@/theme";

interface Props {
  member: Member;
  /** Whether the member has a confirmed contribution for the active cycle. */
  paid: boolean;
  /** Amount to show on the right: the confirmed amount, or the expected contribution. */
  amountLabel: string;
}

export function MemberRow({ member, paid, amountLabel }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  return (
    <View style={[styles.row, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={[styles.avatar, { backgroundColor: colors.surfaceAlt }]}>
        <Text style={[styles.avatarText, { color: colors.primary }]}>{member.name.slice(0, 1)}</Text>
      </View>
      <View style={styles.main}>
        <Text style={[styles.name, { color: colors.text }]}>{member.name}</Text>
        <Text style={[styles.meta, { color: colors.muted }]}>{member.phone}</Text>
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
  right: { alignItems: "flex-end", gap: 3 },
  status: { fontWeight: "700", fontSize: 11 },
});
