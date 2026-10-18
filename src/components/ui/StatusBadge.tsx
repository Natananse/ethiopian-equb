import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "@/core/i18n";
import { useTheme } from "@/theme";

/** Pill badge for contribution / payout statuses, with localized labels. */
export function StatusBadge({ status }: { status: string }) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const color =
    status === "confirmed" || status === "paid"
      ? colors.success
      : status === "rejected" || status === "blocked"
        ? colors.danger
        : colors.primary;
  const label =
    status === "pending_approval"
      ? t.pendingApproval
      : status === "scheduled"
        ? t.scheduled
        : status === "paid"
          ? t.paidStatus
          : status === "confirmed"
            ? t.confirmed
            : status === "pending"
              ? t.pending
              : status === "rejected"
                ? t.rejected
                : status;
  return (
    <View style={[styles.badge, { borderColor: color, backgroundColor: colors.surface }]}>
      <Text style={{ color, fontSize: 11, fontWeight: "700" }}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 7,
    paddingVertical: 3,
    marginTop: 4,
    alignSelf: "flex-start",
  },
});
