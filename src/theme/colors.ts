export interface ThemeColors {
  /** App scaffold / screen background */
  background: string;
  /** Primary brand surface (header, hero) */
  brand: string;
  brandDeep: string;
  /** Card / panel surface */
  surface: string;
  surfaceAlt: string;
  /** Primary text on surface */
  text: string;
  /** Primary text on brand background */
  onBrand: string;
  onBrandMuted: string;
  muted: string;
  primary: string;
  accent: string;
  success: string;
  danger: string;
  border: string;
  inputBackground: string;
  noticeBackground: string;
  noticeText: string;
  tabBar: string;
  tabInactive: string;
  modalShade: string;
}

export const lightColors: ThemeColors = {
  background: "#F4F9FF",
  brand: "#0A5ED5",
  brandDeep: "#0849A8",
  surface: "#FFFFFF",
  surfaceAlt: "#E5F0FF",
  text: "#0B2F5F",
  onBrand: "#FFFFFF",
  onBrandMuted: "#D7E8FF",
  muted: "#4F6E8E",
  primary: "#0A5ED5",
  accent: "#F5C75B",
  success: "#1FB97A",
  danger: "#D64545",
  border: "#D5E8FF",
  inputBackground: "#EAF2FF",
  noticeBackground: "#DDEEFF",
  noticeText: "#0B4EAF",
  tabBar: "#0B52BD",
  tabInactive: "#DDEEFF",
  modalShade: "#000000AA",
};

export const darkColors: ThemeColors = {
  background: "#071A33",
  brand: "#0B2F5F",
  brandDeep: "#061F42",
  surface: "#0E2A52",
  surfaceAlt: "#14335F",
  text: "#F2F8FF",
  onBrand: "#FFFFFF",
  onBrandMuted: "#B9D2F2",
  muted: "#9FB8D8",
  primary: "#4C93F0",
  accent: "#F5C75B",
  success: "#2BD98F",
  danger: "#F87171",
  border: "#1E4470",
  inputBackground: "#12305A",
  noticeBackground: "#12305A",
  noticeText: "#B9D9FF",
  tabBar: "#081F42",
  tabInactive: "#9FB8D8",
  modalShade: "#000000CC",
};
