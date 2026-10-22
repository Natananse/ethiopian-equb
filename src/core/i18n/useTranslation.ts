import { useSettingsStore } from "@/store/useSettingsStore";
import { translations, type Language, type Translation } from "./translations";

/** Current UI copy for the persisted language choice. */
export function useTranslation(): { t: Translation; language: Language } {
  const language = useSettingsStore((s) => s.language);
  return { t: translations[language], language };
}
