import { StyleSheet, Text } from "react-native";
import { radius, useTheme } from "@/theme";

export function Notice({ children }: { children: string }) {
  const { colors } = useTheme();
  return <Text style={[styles.notice, { color: colors.noticeText, backgroundColor: colors.noticeBackground }]}>{children}</Text>;
}

const styles = StyleSheet.create({
  notice: { borderRadius: radius.sm + 2, padding: 12, fontSize: 12, lineHeight: 18, overflow: "hidden" },
});
