import { Platform } from "react-native";

export const palette = {
  ink: "#211814",
  muted: "#75665d",
  faint: "#9b8d84",
  espresso: "#2b1208",
  mahogany: "#3c1a06",
  brown: "#5a3d2b",
  bronze: "#b9824c",
  gold: "#d8aa62",
  cream: "#fff8ef",
  parchment: "#f7efe4",
  sand: "#ead9c4",
  rose: "#f7d9d0",
  sage: "#dce8d4",
  sky: "#d9e8f7",
  white: "#ffffff",
  danger: "#c3473f",
  success: "#3f7f55",
  border: "#eadfd2",
};

export const gradients = {
  brand: [palette.espresso, palette.mahogany, palette.brown] as const,
  page: [palette.cream, "#fbf2e8", "#ffffff"] as const,
  card: ["#ffffff", "#fff9f1"] as const,
  gold: ["#f3d390", palette.bronze] as const,
};

export const radius = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 22,
  xl: 30,
  pill: 999,
};

export const spacing = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  xxl: 32,
};

export const shadow = {
  soft: {
    shadowColor: palette.espresso,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 22,
    elevation: 4,
  },
  medium: {
    shadowColor: palette.espresso,
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.14,
    shadowRadius: 26,
    elevation: 7,
  },
  glow: {
    shadowColor: palette.bronze,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: Platform.OS === "android" ? 0.2 : 0.28,
    shadowRadius: 24,
    elevation: 8,
  },
};

export const type = {
  hero: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "800" as const,
    color: palette.white,
  },
  title: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "800" as const,
    color: palette.ink,
  },
  section: {
    fontSize: 17,
    lineHeight: 23,
    fontWeight: "800" as const,
    color: palette.ink,
  },
  body: {
    fontSize: 14,
    lineHeight: 21,
    color: palette.muted,
  },
  label: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "700" as const,
    color: palette.brown,
  },
};

export const commonStyles = {
  page: {
    flex: 1,
    backgroundColor: palette.cream,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: 110,
  },
  card: {
    backgroundColor: palette.white,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadow.soft,
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: palette.ink,
    backgroundColor: "rgba(255,255,255,0.92)",
  },
  primaryButton: {
    minHeight: 52,
    borderRadius: radius.pill,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    backgroundColor: palette.mahogany,
    paddingHorizontal: spacing.xl,
    ...shadow.glow,
  },
  primaryButtonText: {
    color: palette.white,
    fontWeight: "800" as const,
    fontSize: 15,
  },
};
