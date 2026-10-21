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
    <View style={[styles.row, { backgroundColor: colors.surfaceAlt }]}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            style={[
              styles.segment,
              { backgroundColor: selected ? colors.surface : "transparent", borderColor: colors.border },
              selected && styles.selectedSegment,
            ]}
          >
            <Text style={[styles.text, { color: selected ? colors.primary : colors.muted }]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 4, marginTop: 5, padding: 4, borderRadius: radius.md },
  segment: {
    borderRadius: radius.sm,
    paddingHorizontal: 13,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    minHeight: 44,
  },
  selectedSegment: { shadowColor: "#142B20", shadowOpacity: 0.08, shadowRadius: 5, shadowOffset: { width: 0, height: 2 }, elevation: 1 },
  text: { fontWeight: "700", fontSize: 12, textAlign: "center" },
});
