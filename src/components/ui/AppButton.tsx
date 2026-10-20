import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { radius, useTheme } from "@/theme";

interface Props {
  label: string;
  onPress: () => void;
  icon?: "add";
  secondary?: boolean;
  disabled?: boolean;
}

export function AppButton({ label, onPress, icon, secondary = false, disabled = false }: Props) {
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
      <View style={styles.content}>
        {icon ? <Ionicons name={icon} size={16} color={secondary ? colors.primary : colors.onBrand} /> : null}
        <Text style={[styles.text, { color: colors.onBrand }, secondary && { color: colors.primary }]}>{label}</Text>
      </View>
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
  content: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 },
  text: { fontWeight: "800", fontSize: 12, textAlign: "center" },
  disabled: { opacity: 0.5 },
});
