import { DefaultTheme, configureFonts, useTheme } from "react-native-paper";

// Define color palette
const colors = {
  bg: "#ffffff",
  text: "#0f172a", // slate-900
  muted: "#475569", // slate-600
  border: "#e2e8f0", // slate-200
  primary: "#5C3BFF", // indigo-600
  primary700: "#4338ca", // indigo-700
  accent: "#2F2FEA", // violet-600
  success: "#059669", // emerald-600
  light: "#f8fafc", // slate-50,
};

// Complete MD3 font configuration
const fontConfig = {
  displayLarge: {
    fontFamily: "System",
    fontWeight: "400" as const,
    fontSize: 57,
    lineHeight: 64,
    letterSpacing: -0.25,
  },
  displayMedium: {
    fontFamily: "System",
    fontWeight: "400" as const,
    fontSize: 45,
    lineHeight: 52,
    letterSpacing: 0,
  },
  displaySmall: {
    fontFamily: "System",
    fontWeight: "400" as const,
    fontSize: 36,
    lineHeight: 44,
    letterSpacing: 0,
  },
  headlineLarge: {
    fontFamily: "System",
    fontWeight: "400" as const,
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: 0,
  },
  headlineMedium: {
    fontFamily: "System",
    fontWeight: "400" as const,
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: 0,
  },
  headlineSmall: {
    fontFamily: "System",
    fontWeight: "400" as const,
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: 0,
  },
  titleLarge: {
    fontFamily: "System",
    fontWeight: "600" as const,
    fontSize: 48,
    lineHeight: 56,
    letterSpacing: 0,
  },
  titleMedium: {
    fontFamily: "System",
    fontWeight: "600" as const,
    fontSize: 42,
    lineHeight: 44,
    letterSpacing: 0.15,
  },
  titleSmall: {
    fontFamily: "System",
    fontWeight: "600" as const,
    fontSize: 36,
    lineHeight: 40,
    letterSpacing: 0.1,
  },
  bodyLarge: {
    fontFamily: "System",
    fontWeight: "400" as const,
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: 0.5,
  },
  bodyMedium: {
    fontFamily: "System",
    fontWeight: "400" as const,
    fontSize: 18,
    lineHeight: 28,
    letterSpacing: 0.25,
  },
  bodySmall: {
    fontFamily: "System",
    fontWeight: "100" as const,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0.4,
  },
  labelLarge: {
    fontFamily: "System",
    fontWeight: "500" as const,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  labelMedium: {
    fontFamily: "System",
    fontWeight: "500" as const,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.5,
  },
  labelSmall: {
    fontFamily: "System",
    fontWeight: "500" as const,
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 0.5,
  },
};

const fonts = configureFonts({
  config: fontConfig,
  isV3: true,
});

// Create the theme
export const appTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    // Primary colors
    primary: colors.primary,
    accent: colors.accent,

    // Background colors
    background: colors.bg,
    surface: colors.bg,
    backdrop: "rgba(15, 23, 42, 0.5)", // semi-transparent slate-900

    // Text colors
    text: colors.text,
    onSurface: colors.text,
    onBackground: colors.text,

    // Status colors
    error: "#dc2626", // red-600 (added for completeness)
    success: colors.success,
    warning: "#d97706", // amber-600 (added for completeness)
    info: "#0284c7", // sky-600 (added for completeness)

    // State colors
    disabled: colors.muted,
    placeholder: colors.muted,
    notification: colors.accent,

    // Additional custom colors
    custom: {
      muted: colors.muted,
      border: colors.border,
      light: colors.light,
      primary700: colors.primary700,
    },
  },
  fonts: fonts,
  roundness: 8,
  animation: {
    scale: 1,
  },
};

// Extended theme with custom colors for use in components
export type AppTheme = typeof appTheme;

// Utility hook for using the theme
export const useAppTheme = () => useTheme() as AppTheme;
