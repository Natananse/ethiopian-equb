import { Pressable, StyleSheet, Text, View } from "react-native";
import { radius, useTheme } from "@/theme";

interface Option<T extends string> {
  value: T;
  label: string;
}

interface Props<T extends string> {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
}

export function SegmentedControl<T extends string>({ options, value, onChange }: Props<T>) {
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            style={[
              styles.segment,
              { backgroundColor: colors.primary, borderColor: colors.border },
              !selected && { backgroundColor: colors.surface, borderWidth: 1 },
            ]}
          >
            <Text style={[styles.text, { color: colors.onBrand }, !selected && { color: colors.primary }]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 9, marginTop: 5 },
  segment: {
    borderRadius: radius.sm + 2,
    paddingHorizontal: 13,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    minHeight: 42,
  },
  text: { fontWeight: "800", fontSize: 12, textAlign: "center" },
});
