import { StyleSheet, TextInput, type TextInputProps } from "react-native";
import { radius, useTheme } from "@/theme";

export function AppTextInput(props: TextInputProps) {
  const { colors } = useTheme();
  return (
    <TextInput
      placeholderTextColor={colors.muted}
      {...props}
      style={[
        styles.input,
        { backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.text },
        props.style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: 15,
    paddingVertical: 14,
    fontSize: 15,
    marginTop: 7,
  },
});
