import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Palette, Radii, Shadows, Spacing } from "../theme/theme";
import type { Translations } from "../i18n/translations";

export type TabKey = "home" | "explore" | "equb" | "payments" | "profile";

interface BottomNavProps {
  activeTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
  onCreateEqub: () => void;
  t: Translations;
  pendingCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  onCreateEqub,
  t,
  pendingCount = 0,
}) => {
  const tabs: Array<{
    key: TabKey;
    label: string;
    icon: string;
  }> = [
    { key: "home", label: t.navHome, icon: "⌂" },
    { key: "explore", label: t.navExplore, icon: "⌕" },
    { key: "equb", label: t.navMyEqub, icon: "◎" },
    { key: "payments", label: t.navPayments, icon: "💳" },
    { key: "profile", label: t.navProfile, icon: "👤" },
  ];

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <Pressable
              key={tab.key}
              onPress={() => onSelectTab(tab.key)}
              style={({ pressed }) => [
                styles.tabItem,
                isActive && styles.tabItemActive,
                pressed && styles.tabItemPressed,
              ]}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
            >
              <View style={styles.iconWrap}>
                <Text
                  style={[
                    styles.tabIcon,
                    isActive ? styles.tabIconActive : styles.tabIconInactive,
                  ]}
                >
                  {tab.icon}
                </Text>
                {tab.key === "payments" && pendingCount > 0 && (
                  <View style={styles.badgeDot}>
                    <Text style={styles.badgeDotText}>{pendingCount}</Text>
                  </View>
                )}
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  isActive ? styles.tabLabelActive : styles.tabLabelInactive,
                ]}
                numberOfLines={1}
              >
                {tab.label}
              </Text>
              {isActive && <View style={styles.activeIndicator} />}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: Palette.surfaceWhite,
    borderTopWidth: 1,
    borderTopColor: Palette.neutralBorder,
    ...Shadows.card,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingTop: Spacing.xs + 2,
    paddingBottom: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
    position: "relative",
  },
  tabItemActive: {},
  tabItemPressed: {
    opacity: 0.7,
  },
  iconWrap: {
    position: "relative",
    width: 28,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  tabIcon: {
    fontSize: 18,
  },
  tabIconActive: {
    color: Palette.royalBlue,
  },
  tabIconInactive: {
    color: Palette.textMuted,
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 2,
  },
  tabLabelActive: {
    color: Palette.royalBlue,
    fontWeight: "800",
  },
  tabLabelInactive: {
    color: Palette.textMuted,
    fontWeight: "500",
  },
  activeIndicator: {
    width: 14,
    height: 3,
    borderRadius: 2,
    backgroundColor: Palette.royalBlue,
    marginTop: 3,
  },
  badgeDot: {
    position: "absolute",
    top: -3,
    right: -6,
    backgroundColor: Palette.pendingAmber,
    borderRadius: 8,
    minWidth: 14,
    height: 14,
    paddingHorizontal: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeDotText: {
    color: Palette.surfaceWhite,
    fontSize: 8.5,
    fontWeight: "900",
  },
});
