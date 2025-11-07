import HeaderTitle from "@/components/stack/headerTitle";
import { appTheme } from "@/hooks/theme";
import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/react.query";
import { AuthProvider, useAuth } from "@/hooks/useUserContext";
import { useAppFonts } from "@/hooks/useFonts";
import { ActivityIndicator, StyleSheet, View, Text } from "react-native";

const StackWithGuard = () => {
  const { isLoggedIn, isInitializing } = useAuth();
  if (isInitializing) return null; // or a splash component

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        animation: "slide_from_right",
        gestureEnabled: true,
        gestureDirection: "horizontal",
        headerTitle: (props) => <HeaderTitle {...props} />,
        headerTintColor: "#FF6D00",
      }}
    >
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="log-in" options={{ title: "" }} />
        <Stack.Screen name="sign-up" options={{ title: "" }} />
        <Stack.Screen name="reset-password" options={{ title: "" }} />
      </Stack.Protected>
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="tabs" options={{ title: "", headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
};

export default function RootLayout() {
  const { fontsLoaded, fontError } = useAppFonts();
  // Show loading indicator while fonts are loading
  if (!fontsLoaded) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={appTheme.colors.primary} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Handle font loading errors
  if (fontError) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error loading fonts</Text>
        <Text style={styles.errorSubtext}>
          The app will continue with system fonts
        </Text>
      </View>
    );
  }

  return (
    <PaperProvider theme={appTheme}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <StackWithGuard />
        </AuthProvider>
      </QueryClientProvider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: appTheme.colors.background,
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: appTheme.colors.text,
    fontFamily: "Inter_400Regular",
  },
  errorText: {
    fontSize: 18,
    color: appTheme.colors.error,
    fontFamily: "Inter_600SemiBold",
    textAlign: "center",
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: appTheme.colors.text,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
});
