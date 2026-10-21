import { ClerkProvider, useAuth } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { Stack } from "expo-router";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ConvexAuthBridge } from "@/auth/ConvexAuthBridge";
import { AppFeedback } from "@/components/layout/AppFeedback";
import { useTranslation } from "@/core/i18n";
import { useSettingsHydration } from "@/hooks/useSettingsHydration";
import { EqubProvider } from "@/store";
import { useTheme } from "@/theme";

const clerkPublishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

function LoadingScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  return (
    <View style={[styles.loading, { backgroundColor: colors.brand }]}>
      <ActivityIndicator size="large" color={colors.accent} />
      <Text style={{ color: colors.onBrandMuted, fontSize: 13 }}>{t.loading}</Text>
    </View>
  );
}

function AuthenticatedRoutes() {
  const auth = useAuth();
  const settingsHydrated = useSettingsHydration();
  const { colors } = useTheme();
  const { t } = useTranslation();

  if (!auth.isLoaded || !settingsHydrated) return <LoadingScreen />;
  if (!auth.isSignedIn) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="sign-in" />
        <Stack.Screen name="oauth-callback" />
      </Stack>
    );
  }

  return (
    <EqubProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="access" />
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
        <Stack.Screen name="oauth-callback" />
      </Stack>
    </EqubProvider>
  );
}

function AppProviders() {
  return (
    <SafeAreaProvider>
      <ExpoStatusBar style="light" />
      <ConvexAuthBridge>
        <AuthenticatedRoutes />
      </ConvexAuthBridge>
      <AppFeedback />
    </SafeAreaProvider>
  );
}

export default function RootLayout() {
  if (!clerkPublishableKey) {
    return (
      <View style={styles.configError}>
        <Text style={styles.configTitle}>Authentication is not configured</Text>
        <Text style={styles.configText}>Set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your Expo environment, then rebuild the app.</Text>
      </View>
    );
  }

  return (
    <ClerkProvider publishableKey={clerkPublishableKey} tokenCache={tokenCache}>
      <AppProviders />
    </ClerkProvider>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  configError: { flex: 1, justifyContent: "center", padding: 24, gap: 12, backgroundColor: "#fff" },
  configTitle: { color: "#111827", fontSize: 20, fontWeight: "800" },
  configText: { color: "#4b5563", fontSize: 14, lineHeight: 21 },
});
