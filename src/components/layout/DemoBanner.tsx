import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "@/core/i18n";
import { useTheme } from "@/theme";

export function DemoBanner() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  return (
    <View style={[styles.banner, { backgroundColor: colors.surfaceAlt, borderBottomColor: colors.border }]}>
      <Ionicons name="flask-outline" size={14} color={colors.primary} />
      <Text style={[styles.text, { color: colors.noticeText }]}>{t.demoNotice}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { paddingVertical: 9, paddingHorizontal: 16, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7, borderBottomWidth: StyleSheet.hairlineWidth },
  text: { fontSize: 10, textAlign: "center", fontWeight: "700" },
});
