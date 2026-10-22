import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { radius, useTheme } from "@/theme";

export function Notice({ children }: { children: string }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.notice, { backgroundColor: colors.noticeBackground, borderColor: colors.border }]}>
      <Ionicons name="information-circle-outline" size={19} color={colors.primary} />
      <Text style={[styles.text, { color: colors.noticeText }]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  notice: { borderRadius: radius.md, padding: 13, borderWidth: StyleSheet.hairlineWidth, flexDirection: "row", alignItems: "flex-start", gap: 9 },
  text: { flex: 1, fontSize: 12, lineHeight: 18 },
});
