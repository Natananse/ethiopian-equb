/**
 * Ethiopian Equb — Design System & Visual Identity
 *
 * Palette:
 * - Deep Royal Blue (#1258C8): Primary brand anchor, primary buttons, focal points
 * - Midnight Navy (#172B43): Premium dark background, headers, deep text
 * - Warm Ivory (#F7F5EF): Culturally authentic warm background surface
 * - Card Surface White (#FFFFFF): Crisp, high-contrast readable cards
 * - Neutral Surface (#EFECE4): Subtle borders, chips, secondary surfaces
 * - Ethiopian Woven Gold Accent (#C68A45): Traditional mesob/textile accent, milestones
 * - Fresh Green (#21856A): Confirmed payments, verified states, success indicators
 * - Soft Green (#E8F5F1): Background tint for verified badges
 * - Warm Amber (#B87B2E): Pending verification, upcoming deadlines
 * - Soft Amber (#FEF7ED): Background tint for pending badges
 * - Brick Red (#C53030): Rejected payments, overdue alerts, critical warnings
 * - Soft Red (#FEE2E2): Background tint for rejected badges
 * - Muted Slate (#788594): Secondary labels, timestamps, inactive elements
 */

export const Palette = {
  // Brand Anchors
  royalBlue: "#1258C8",
  royalBlueDark: "#0D4299",
  royalBlueLight: "#EEF4FD",
  midnightNavy: "#172B43",
  midnightNavyDark: "#0F1D2D",
  midnightNavyLight: "#223B59",

  // Warm Cultural Neutrals
  warmIvory: "#F7F5EF",
  surfaceWhite: "#FFFFFF",
  neutralBorder: "#E5E1D5",
  neutralDivider: "#ECE8DD",
  neutralSurface: "#EFECE4",

  // Cultural Textile Accent
  wovenGold: "#C68A45",
  wovenGoldDark: "#9E692B",
  wovenGoldLight: "#FAF3EA",

  // Semantic Financial Colors
  confirmedGreen: "#21856A",
  confirmedGreenSurface: "#E8F5F1",
  confirmedGreenBorder: "#B7E2D5",

  pendingAmber: "#B87B2E",
  pendingAmberSurface: "#FEF7ED",
  pendingAmberBorder: "#F6DFBE",

  rejectedRed: "#C53030",
  rejectedRedSurface: "#FEE2E2",
  rejectedRedBorder: "#FCA5A5",

  // Neutral Typography
  textPrimary: "#172B43",
  textSecondary: "#5E7083",
  textMuted: "#788594",
  textOnDark: "#FFFFFF",
  textOnDarkMuted: "#B8C5D3",
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  hero: 32,
};

export const Radii = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  full: 999,
};

export const Typography = {
  // Headers
  h1: { fontSize: 26, fontWeight: "800" as const, lineHeight: 32 },
  h2: { fontSize: 20, fontWeight: "700" as const, lineHeight: 26 },
  h3: { fontSize: 16, fontWeight: "700" as const, lineHeight: 22 },
  
  // Body
  bodyLarge: { fontSize: 15, fontWeight: "500" as const, lineHeight: 21 },
  body: { fontSize: 13, fontWeight: "400" as const, lineHeight: 18 },
  bodyMedium: { fontSize: 13, fontWeight: "600" as const, lineHeight: 18 },
  caption: { fontSize: 11, fontWeight: "500" as const, lineHeight: 15 },
  label: { fontSize: 10, fontWeight: "700" as const, letterSpacing: 0.8, textTransform: "uppercase" as const },
  
  // Financial Numbers
  amountHero: { fontSize: 30, fontWeight: "800" as const, letterSpacing: -0.5 },
  amountLarge: { fontSize: 22, fontWeight: "800" as const },
  amountMedium: { fontSize: 16, fontWeight: "700" as const },
};

export const Shadows = {
  subtle: {
    shadowColor: "#172B43",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  card: {
    shadowColor: "#172B43",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  raised: {
    shadowColor: "#1258C8",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 14,
    elevation: 6,
  },
  floating: {
    shadowColor: "#1258C8",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 16,
    elevation: 8,
  },
};
