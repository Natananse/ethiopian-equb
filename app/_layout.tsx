import { Stack } from "expo-router";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useTranslation } from "@/core/i18n";
import { useStoreHydration } from "@/hooks/useStoreHydration";
import { useTheme } from "@/theme";

function HydrationGate() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  return (
    <View style={[styles.loading, { backgroundColor: colors.brand }]}>
      <ActivityIndicator size="large" color={colors.accent} />
      <Text style={{ color: colors.onBrandMuted, fontSize: 13 }}>{t.loading}</Text>
    </View>
  );
}

export default function RootLayout() {
  const hydrated = useStoreHydration();
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <SafeAreaProvider>
      {/* The brand header is dark blue in both themes, so status icons stay light. */}
      <ExpoStatusBar style="light" />
      {!hydrated ? (
        <HydrationGate />
      ) : (
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="add-member"
            options={{ presentation: "modal", headerShown: true, title: t.addMember, headerStyle: { backgroundColor: colors.surface }, headerTintColor: colors.text }}
          />
          <Stack.Screen
            name="edit-member"
            options={{ presentation: "modal", headerShown: true, title: t.editMember, headerStyle: { backgroundColor: colors.surface }, headerTintColor: colors.text }}
          />
          <Stack.Screen
            name="record-payment"
            options={{ presentation: "modal", headerShown: true, title: t.recordPayment, headerStyle: { backgroundColor: colors.surface }, headerTintColor: colors.text }}
          />
        </Stack>
      )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
});
