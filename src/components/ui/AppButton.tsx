import { Pressable, StyleSheet, Text } from "react-native";
import { radius, useTheme } from "@/theme";

interface Props {
  label: string;
  onPress: () => void;
  secondary?: boolean;
  disabled?: boolean;
}

export function AppButton({ label, onPress, secondary = false, disabled = false }: Props) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        { backgroundColor: colors.primary },
        secondary && { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
        disabled && styles.disabled,
      ]}
    >
      <Text style={[styles.text, { color: colors.onBrand }, secondary && { color: colors.primary }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: radius.sm + 2,
    paddingHorizontal: 13,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    minHeight: 42,
  },
  text: { fontWeight: "800", fontSize: 12, textAlign: "center" },
  disabled: { opacity: 0.5 },
});
