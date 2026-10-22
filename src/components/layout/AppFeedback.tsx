import { Ionicons } from "@expo/vector-icons";
import { BottomSheet } from "@expo/ui";
import { StyleSheet, Text, View } from "react-native";
import Toast, { BaseToast, type ToastConfig } from "react-native-toast-message";
import { useFeedbackStore } from "@/store/useFeedbackStore";
import { radius, spacing, useTheme } from "@/theme";
import { AppButton } from "../ui/AppButton";

const toastConfig: ToastConfig = {
  success: ({ text1, text2 }) => <FeedbackToast type="success" text1={text1} text2={text2} />,
  error: ({ text1, text2 }) => <FeedbackToast type="error" text1={text1} text2={text2} />,
  info: ({ text1, text2 }) => <FeedbackToast type="info" text1={text1} text2={text2} />,
};

function FeedbackToast({ type, text1, text2 }: { type: "success" | "error" | "info"; text1?: string; text2?: string }) {
  const { colors } = useTheme();
  const tint = type === "success" ? colors.success : type === "error" ? colors.danger : colors.primary;
  const icon = type === "success" ? "checkmark-circle" : type === "error" ? "alert-circle" : "information-circle";
  return (
    <BaseToast
      text1={text1}
      text2={text2}
      style={[styles.toast, { backgroundColor: colors.surface, borderColor: colors.border }]}
      contentContainerStyle={styles.toastContent}
      text1Style={[styles.toastTitle, { color: colors.text }]}
      text2Style={[styles.toastMessage, { color: colors.muted }]}
      renderLeadingIcon={() => (
        <View style={[styles.toastIcon, { backgroundColor: `${tint}1A` }]}>
          <Ionicons name={icon} size={20} color={tint} />
        </View>
      )}
    />
  );
}

export function AppFeedback() {
  const confirmation = useFeedbackStore((state) => state.confirmation);
  const resolveConfirmation = useFeedbackStore((state) => state.resolveConfirmation);
  const { colors } = useTheme();

  return (
    <>
      <BottomSheet
        isPresented={confirmation !== null}
        onDismiss={() => resolveConfirmation(false)}
        containerColor={colors.surface}
        snapPoints={["half"]}
        testID="confirmation-bottom-sheet"
      >
        {confirmation ? (
          <View style={styles.sheetContent}>
            <View style={[styles.icon, { backgroundColor: confirmation.danger ? `${colors.danger}1A` : colors.surfaceAlt }]}>
              <Ionicons
                name={confirmation.icon ?? (confirmation.danger ? "warning-outline" : "help-circle-outline")}
                size={26}
                color={confirmation.danger ? colors.danger : colors.primary}
              />
            </View>
            <Text style={[styles.title, { color: colors.text }]}>{confirmation.title}</Text>
            <Text style={[styles.message, { color: colors.muted }]}>{confirmation.message}</Text>
            <View style={styles.actions}>
              <AppButton label={confirmation.cancelLabel} onPress={() => resolveConfirmation(false)} secondary />
              <AppButton
                label={confirmation.confirmLabel}
                onPress={() => resolveConfirmation(true)}
                danger={confirmation.danger}
              />
            </View>
          </View>
        ) : null}
      </BottomSheet>
      <Toast config={toastConfig} topOffset={48} visibilityTime={3500} />
    </>
  );
}

const styles = StyleSheet.create({
  sheetContent: { alignItems: "center", paddingHorizontal: spacing.xl, paddingTop: spacing.md, paddingBottom: spacing.xl, gap: spacing.md },
  icon: { width: 56, height: 56, borderRadius: radius.lg, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 20, fontWeight: "800", textAlign: "center" },
  message: { fontSize: 14, lineHeight: 21, textAlign: "center" },
  actions: { flexDirection: "row", width: "100%", gap: 10, marginTop: spacing.sm },
  toast: { width: "92%", minHeight: 66, borderRadius: radius.md, borderWidth: StyleSheet.hairlineWidth, borderLeftWidth: 0, elevation: 8, shadowColor: "#10251A", shadowOpacity: 0.13, shadowRadius: 14, shadowOffset: { width: 0, height: 6 } },
  toastContent: { paddingHorizontal: 12 },
  toastTitle: { fontSize: 13, fontWeight: "800" },
  toastMessage: { fontSize: 11, marginTop: 2 },
  toastIcon: { width: 35, height: 35, borderRadius: 12, alignItems: "center", justifyContent: "center", marginLeft: 12 },
});
