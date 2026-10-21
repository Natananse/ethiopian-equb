import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { useTranslation } from "@/core/i18n";
import { useTheme } from "@/theme";

export default function TabsLayout() {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
        },
        tabBarLabelStyle: { fontSize: 10, fontWeight: "700", marginTop: 2 },
        tabBarItemStyle: { borderRadius: 16, marginHorizontal: 3, marginVertical: 3 },
        tabBarActiveBackgroundColor: colors.surfaceAlt,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: t.dashboard, tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={22} color={color} /> }}
      />
      <Tabs.Screen
        name="members"
        options={{ title: t.members, tabBarIcon: ({ color }) => <Ionicons name="people-outline" size={22} color={color} /> }}
      />
      <Tabs.Screen
        name="draw"
        options={{ title: t.drawLottery, tabBarIcon: ({ color }) => <Ionicons name="sparkles-outline" size={22} color={color} /> }}
      />
      <Tabs.Screen
        name="payments"
        options={{ title: t.finance, tabBarIcon: ({ color }) => <Ionicons name="wallet-outline" size={22} color={color} /> }}
      />
      <Tabs.Screen
        name="payouts"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="settings"
        options={{ href: null }}
      />
    </Tabs>
  );
}
