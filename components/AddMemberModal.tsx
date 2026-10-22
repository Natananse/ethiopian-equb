import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Modal,
  Alert,
} from "react-native";
import { Palette, Radii, Shadows, Spacing } from "../theme/theme";
import type { Translations } from "../i18n/translations";

interface AddMemberModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (name: string, phone: string) => void;
  t: Translations;
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({
  visible,
  onClose,
  onAdd,
  t,
}) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSave = () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert(t.requiredError, "እባክዎ የአባሉን ሙሉ ስምና ስልክ ቁጥር ያስገቡ።");
      return;
    }
    onAdd(name.trim(), phone.trim());
    setName("");
    setPhone("");
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>{t.addMemberBtn}</Text>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </Pressable>
          </View>

          <Text style={styles.fieldLabel}>{t.memberNameLabel} *</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="ለምሳሌ፦ አበበ በቀለ"
            placeholderTextColor={Palette.textMuted}
            style={styles.input}
          />

          <Text style={styles.fieldLabel}>{t.memberPhoneLabel} *</Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="0911 23 45 67"
            keyboardType="phone-pad"
            placeholderTextColor={Palette.textMuted}
            style={styles.input}
          />

          <View style={styles.actionRow}>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [styles.cancelBtn, pressed && styles.btnPressed]}
            >
              <Text style={styles.cancelText}>{t.cancel}</Text>
            </Pressable>

            <Pressable
              onPress={handleSave}
              style={({ pressed }) => [styles.saveBtn, pressed && styles.btnPressed]}
            >
              <Text style={styles.saveText}>{t.save}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 29, 45, 0.7)",
    justifyContent: "center",
    padding: Spacing.lg,
  },
  card: {
    backgroundColor: Palette.surfaceWhite,
    borderRadius: Radii.lg,
    padding: Spacing.lg,
    ...Shadows.floating,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.md,
  },
  title: {
    color: Palette.midnightNavy,
    fontSize: 17,
    fontWeight: "800",
  },
  closeBtn: {
    padding: 6,
  },
  closeText: {
    color: Palette.textMuted,
    fontSize: 14,
  },
  fieldLabel: {
    color: Palette.midnightNavy,
    fontSize: 12,
    fontWeight: "700",
    marginTop: Spacing.sm,
    marginBottom: 4,
  },
  input: {
    backgroundColor: Palette.neutralSurface,
    borderWidth: 1,
    borderColor: Palette.neutralBorder,
    borderRadius: Radii.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    fontSize: 13,
    color: Palette.midnightNavy,
  },
  actionRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  cancelBtn: {
    backgroundColor: Palette.neutralSurface,
    borderRadius: Radii.md,
    paddingVertical: 11,
    paddingHorizontal: Spacing.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelText: {
    color: Palette.midnightNavy,
    fontSize: 12.5,
    fontWeight: "700",
  },
  saveBtn: {
    flex: 1,
    backgroundColor: Palette.royalBlue,
    borderRadius: Radii.md,
    paddingVertical: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  saveText: {
    color: Palette.surfaceWhite,
    fontSize: 13,
    fontWeight: "800",
  },
  btnPressed: {
    opacity: 0.85,
  },
});
