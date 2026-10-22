import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { ComponentProps } from "react";
import { radius, useTheme } from "@/theme";

interface Props {
  label: string;
  onPress: () => void;
  icon?: ComponentProps<typeof Ionicons>["name"];
  accent?: boolean;
  danger?: boolean;
  secondary?: boolean;
  disabled?: boolean;
}

export function AppButton({ label, onPress, icon, accent = false, danger = false, secondary = false, disabled = false }: Props) {
  const { colors } = useTheme();
  const foreground = secondary ? danger ? colors.danger : colors.primary : accent ? colors.brandDeep : colors.onBrand;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: danger && !secondary ? colors.danger : accent ? colors.accent : colors.primary },
        secondary && { backgroundColor: colors.surface, borderWidth: 1, borderColor: danger ? `${colors.danger}55` : colors.border },
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <View style={styles.content}>
        {icon ? <Ionicons name={icon} size={16} color={foreground} /> : null}
        <Text style={[styles.text, { color: foreground }]}>{label}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: radius.md,
    paddingHorizontal: 13,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    minHeight: 48,
  },
  content: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 },
  text: { fontWeight: "800", fontSize: 13, textAlign: "center" },
  disabled: { opacity: 0.5 },
  pressed: { opacity: 0.86, transform: [{ scale: 0.99 }] },
});
