import { Tabs } from "expo-router";
import { Text, type ColorValue } from "react-native";
import { useTranslation } from "@/core/i18n";
import { useTheme } from "@/theme";

function TabIcon({ glyph, color }: { glyph: string; color: ColorValue }) {
  return <Text style={{ color, fontSize: 20 }}>{glyph}</Text>;
}

export default function TabsLayout() {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarActiveBackgroundColor: colors.surface,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.border,
        },
        tabBarLabelStyle: { fontSize: 10, fontWeight: "700" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: t.dashboard, tabBarIcon: ({ color }) => <TabIcon glyph="⌂" color={color} /> }}
      />
      <Tabs.Screen
        name="members"
        options={{ title: t.members, tabBarIcon: ({ color }) => <TabIcon glyph="⌕" color={color} /> }}
      />
      <Tabs.Screen
        name="payments"
        options={{ title: t.payments, tabBarIcon: ({ color }) => <TabIcon glyph="◫" color={color} /> }}
      />
      <Tabs.Screen
        name="payouts"
        options={{ title: t.payouts, tabBarIcon: ({ color }) => <TabIcon glyph="▣" color={color} /> }}
      />
      <Tabs.Screen
        name="settings"
        options={{ title: t.settings, tabBarIcon: ({ color }) => <TabIcon glyph="◌" color={color} /> }}
      />
    </Tabs>
  );
}
