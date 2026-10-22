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
  background: "#F5F6F0",
  brand: "#174D3F",
  brandDeep: "#103B31",
  surface: "#FFFFFF",
  surfaceAlt: "#E8EFE7",
  text: "#1B3029",
  onBrand: "#FFFFFF",
  onBrandMuted: "#C9DED3",
  muted: "#718078",
  primary: "#26745A",
  accent: "#E6B94F",
  success: "#23805B",
  danger: "#C34F48",
  border: "#E3E8DF",
  inputBackground: "#FFFFFF",
  noticeBackground: "#EAF1E9",
  noticeText: "#285B47",
  tabBar: "#FFFFFF",
  tabInactive: "#8B978F",
  modalShade: "#000000AA",
};

export const darkColors: ThemeColors = {
  background: "#111B18",
  brand: "#173D32",
  brandDeep: "#102F27",
  surface: "#1A2923",
  surfaceAlt: "#24382F",
  text: "#F0F4EF",
  onBrand: "#FFFFFF",
  onBrandMuted: "#BCD2C5",
  muted: "#A0B0A6",
  primary: "#71B994",
  accent: "#E6B94F",
  success: "#65C58E",
  danger: "#F07E75",
  border: "#30443A",
  inputBackground: "#1D3028",
  noticeBackground: "#24382F",
  noticeText: "#C9E5D4",
  tabBar: "#17251F",
  tabInactive: "#91A398",
  modalShade: "#000000CC",
};
