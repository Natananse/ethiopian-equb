import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "@/core/i18n";
import { useTheme } from "@/theme";

export function DemoBanner() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  return (
    <View style={[styles.banner, { backgroundColor: colors.brandDeep }]}>
      <Text style={[styles.text, { color: colors.onBrand }]}>{t.demoNotice}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { paddingVertical: 8, paddingHorizontal: 14 },
  text: { fontSize: 10, textAlign: "center", fontWeight: "700" },
});
