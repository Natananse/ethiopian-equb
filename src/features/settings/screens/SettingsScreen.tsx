import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { AppButton, Card, Notice, Screen, SegmentedControl, ThemeToggle } from "@/components/ui";
import { money } from "@/core/engine";
import { useTranslation, type Language } from "@/core/i18n";
import { useEqubStore, useSettingsStore, type ThemeMode } from "@/store";
import { spacing, useTheme } from "@/theme";

export function SettingsScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const data = useEqubStore((s) => s.data);
  const resetDemo = useEqubStore((s) => s.resetDemo);
  const language = useSettingsStore((s) => s.language);
  const setLanguage = useSettingsStore((s) => s.setLanguage);
  const themeMode = useSettingsStore((s) => s.themeMode);
  const setThemeMode = useSettingsStore((s) => s.setThemeMode);

  const reset = () =>
    Alert.alert(t.reset, t.resetConfirm, [
      { text: t.cancel, style: "cancel" },
      { text: t.yes, style: "destructive", onPress: resetDemo },
    ]);

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.pageTitle, { color: colors.text }]}>{t.settings}</Text>

        <Card>
          <Text style={[styles.rowTitle, { color: colors.text }]}>{data.groupName}</Text>
          <Text style={[styles.meta, { color: colors.muted }]}>
            {t.memberCount}: {data.members.length}
          </Text>
          <Text style={[styles.meta, { color: colors.muted }]}>
            Contribution: {money(data.contributionAmount)} · Monthly
          </Text>
        </Card>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t.appearance}</Text>
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

        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t.language}</Text>
        <SegmentedControl<Language>
          value={language}
          onChange={setLanguage}
          options={[
            { value: "am", label: "አማርኛ" },
            { value: "en", label: "English" },
          ]}
        />

        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t.dataSafety}</Text>
        <Notice>{t.dataSafetyNotice}</Notice>
        <View style={styles.resetButton}>
          <AppButton label={t.reset} onPress={reset} secondary />
        </View>
        <Text style={[styles.meta, { color: colors.muted }]}>{t.version}</Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, paddingBottom: 30, gap: spacing.md },
  pageTitle: { fontSize: 22, fontWeight: "900" },
  rowTitle: { fontWeight: "700", fontSize: 13 },
  meta: { fontSize: 11, marginTop: 4 },
  sectionTitle: { fontSize: 16, fontWeight: "800", marginTop: 8, marginBottom: 2 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8 },
  resetButton: { flexDirection: "row" },
});
