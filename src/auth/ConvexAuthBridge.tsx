import { useAuth } from "@clerk/expo";
import { ConvexProviderWithAuth, ConvexReactClient } from "convex/react";
import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL;
const convexClient = convexUrl ? new ConvexReactClient(convexUrl) : null;

export function MissingBackendConfiguration() {
  return (
    <View style={styles.error}>
      <Text style={styles.title}>Backend is not configured</Text>
      <Text style={styles.message}>Set EXPO_PUBLIC_CONVEX_URL in your Expo environment to connect this app to Convex.</Text>
    </View>
  );
}

export function ConvexAuthBridge({ children }: { children: ReactNode }) {
  const auth = useAuth();
  if (!convexClient) return <MissingBackendConfiguration />;
  return (
    <ConvexProviderWithAuth
      client={convexClient}
      useAuth={() => ({
        isLoading: !auth.isLoaded,
        isAuthenticated: Boolean(auth.isSignedIn),
        fetchAccessToken: ({ forceRefreshToken }: { forceRefreshToken: boolean }) =>
          auth.getToken({ template: "convex", skipCache: forceRefreshToken }),
      })}
    >
      {children}
    </ConvexProviderWithAuth>
  );
}

const styles = StyleSheet.create({
  error: { flex: 1, justifyContent: "center", padding: 24, gap: 12, backgroundColor: "#fff" },
  title: { color: "#111827", fontSize: 20, fontWeight: "800" },
  message: { color: "#4b5563", fontSize: 14, lineHeight: 21 },
});
