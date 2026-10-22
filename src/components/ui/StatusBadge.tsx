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
    <View style={[styles.badge, { backgroundColor: `${color}1A` }]}>
      <Text style={{ color, fontSize: 11, fontWeight: "700" }}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: "flex-start",
  },
});
