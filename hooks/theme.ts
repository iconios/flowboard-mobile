import {
  MD3LightTheme,
  configureFonts,
  useTheme,
  type MD3Theme,
} from "react-native-paper";
import {
  Inter_100Thin,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black,
} from "@expo-google-fonts/inter";

// Define color palette
const colors = {
  bg: "#ffffff",
  text: "#0F172A", // slate-900
  muted: "#E5E4E2", // slate-600
  border: "#e2e8f0", // slate-200
  primary: "#5C3BFF", // indigo-600
  primary700: "#4338ca", // indigo-700
  accent: "#FF6D00", // violet-600
  success: "#059669", // emerald-600
  light: "#f8fafc", // slate-50,
  secondary: "#28C4A9",
  secondaryText: "#000000",
  surface: "#FFFFFF",
  onSurface: "#0F172A",
  outline: "#0F172A",
};

// Complete MD3 font configuration
const fontConfig = {
  displayLarge: {
    fontFamily: "Inter_400Regular",
    fontSize: 57,
    lineHeight: 64,
    letterSpacing: -0.25,
  },
  displayMedium: {
    fontFamily: "Inter_400Regular",
    fontSize: 45,
    lineHeight: 52,
    letterSpacing: 0,
  },
  displaySmall: {
    fontFamily: "Inter_400Regular",
    fontSize: 36,
    lineHeight: 44,
    letterSpacing: 0,
  },
  headlineLarge: {
    fontFamily: "Inter_800ExtraBold",
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: 0,
  },
  headlineMedium: {
    fontFamily: "Inter_700Bold",
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: 0,
  },
  headlineSmall: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 18,
    lineHeight: 28,
    letterSpacing: 0,
  },
  titleLarge: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 48,
    lineHeight: 56,
    letterSpacing: 0,
  },
  titleMedium: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 42,
    lineHeight: 44,
    letterSpacing: 0.15,
  },
  titleSmall: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 36,
    lineHeight: 40,
    letterSpacing: 0.1,
  },
  bodyLarge: {
    fontFamily: "Inter_400Regular",
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: 0.5,
  },
  bodyMedium: {
    fontFamily: "Inter_400Regular",
    fontSize: 18,
    lineHeight: 28,
    letterSpacing: 0.25,
  },
  bodySmall: {
    fontFamily: "Inter_300Light", // Using Light for bodySmall instead of 100
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0.4,
  },
  labelLarge: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  labelMedium: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.5,
  },
  labelSmall: {
    fontFamily: "Inter_500Medium",
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
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    // Main colors
    primary: colors.primary,
    onPrimary: "#FFFFFF",
    primaryContainer: "#E3D7FF",
    secondary: colors.secondary,
    onSecondary: "#FFFFFF",
    accent: colors.accent,

    // Background colors
    background: colors.bg,
    surface: colors.surface,
    surfaceVariant: "#F3F4FF",
    backdrop: "rgba(15, 23, 42, 0.5)", // semi-transparent slate-900

    // Text colors
    text: colors.text,
    secondaryText: colors.secondaryText,
    onSurface: colors.onSurface,
    onSurfaceVariant: "#4B5563",
    outline: colors.outline,
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

// Export font loading configuration for use in App.js
export const fontAssets = {
  Inter_100Thin: Inter_100Thin,
  Inter_200ExtraLight: Inter_200ExtraLight,
  Inter_300Light: Inter_300Light,
  Inter_400Regular: Inter_400Regular,
  Inter_500Medium: Inter_500Medium,
  Inter_600SemiBold: Inter_600SemiBold,
  Inter_700Bold: Inter_700Bold,
  Inter_800ExtraBold: Inter_800ExtraBold,
  Inter_900Black: Inter_900Black,
};
