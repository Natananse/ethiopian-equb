import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@clerk/expo";
import { AppButton, Card, Notice, Screen, SegmentedControl, ThemeToggle } from "@/components/ui";
import { money } from "@/core/engine";
import { useTranslation, type Language } from "@/core/i18n";
import { showToast } from "@/core/feedback";
import { useEqubStore, useSettingsStore, type ThemeMode } from "@/store";
import { useFeedbackStore } from "@/store/useFeedbackStore";
import { spacing, useTheme } from "@/theme";

export function SettingsScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { signOut } = useAuth();
  const data = useEqubStore((s) => s.data);
  const language = useSettingsStore((s) => s.language);
  const setLanguage = useSettingsStore((s) => s.setLanguage);
  const themeMode = useSettingsStore((s) => s.themeMode);
  const setThemeMode = useSettingsStore((s) => s.setThemeMode);

  const confirmSignOut = async () => {
    const confirmed = await useFeedbackStore.getState().requestConfirmation({
      title: t.signOut,
      message: t.signOutQuestion,
      confirmLabel: t.signOut,
      cancelLabel: t.cancel,
      danger: true,
      icon: "log-out-outline",
    });
    if (!confirmed) return;
    try {
      await signOut();
    } catch (error) {
      showToast("error", "Could not sign out", error instanceof Error ? error.message : "Unknown error");
    }
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heading}>
          <Text style={[styles.pageTitle, { color: colors.text }]}>{t.settings}</Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>{t.dataSafety}</Text>
        </View>

        <Card style={styles.groupCard}>
          <View style={[styles.groupIcon, { backgroundColor: colors.surfaceAlt }]}>
            <Ionicons name="people-outline" size={21} color={colors.primary} />
          </View>
          <View style={styles.groupInfo}>
            <Text style={[styles.rowTitle, { color: colors.text }]}>{data.groupName}</Text>
            <Text style={[styles.meta, { color: colors.muted }]}>{t.memberCount}: {data.members.length}</Text>
            <Text style={[styles.meta, { color: colors.muted }]}>{t.contribution}: {money(data.contributionAmount)}</Text>
          </View>
        </Card>

        <Card style={styles.preferenceCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="color-palette-outline" size={19} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>{t.appearance}</Text>
            </View>
            <ThemeToggle />
          </View>
          <SegmentedControl<ThemeMode>
            value={themeMode}
            onChange={setThemeMode}
            options={[
              { value: "light", label: t.themeLight },
              { value: "dark", label: t.themeDark },
              { value: "system", label: t.themeSystem },
            ]}
          />
        </Card>

        <Card style={styles.preferenceCard}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="language-outline" size={19} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t.language}</Text>
          </View>
          <SegmentedControl<Language>
            value={language}
            onChange={setLanguage}
            options={[
              { value: "am", label: "አማርኛ" },
              { value: "en", label: "English" },
            ]}
          />
        </Card>

        <View style={styles.sectionTitleRow}>
          <Ionicons name="shield-checkmark-outline" size={19} color={colors.primary} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t.dataSafety}</Text>
        </View>
        <Notice>{t.dataSafetyNotice}</Notice>
        <View style={styles.resetButton}>
          <AppButton label={t.signOut} onPress={confirmSignOut} secondary danger icon="log-out-outline" />
        </View>
        <Text style={[styles.meta, { color: colors.muted }]}>{t.version}</Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, paddingBottom: 40, gap: spacing.md },
  heading: { gap: 4, marginBottom: 3 },
  pageTitle: { fontSize: 25, fontWeight: "800" },
  subtitle: { fontSize: 12 },
  groupCard: { flexDirection: "row", alignItems: "center", gap: 13 },
  groupIcon: { width: 46, height: 46, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  groupInfo: { flex: 1 },
  rowTitle: { fontWeight: "800", fontSize: 15 },
  meta: { fontSize: 11, marginTop: 5 },
  preferenceCard: { gap: 8 },
  sectionTitleRow: { flexDirection: "row", alignItems: "center", gap: 9 },
  sectionTitle: { fontSize: 14, fontWeight: "800" },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  resetButton: { flexDirection: "row", marginTop: 4 },
});
