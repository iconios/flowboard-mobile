import HeaderTitle from "@/components/stack/headerTitle";
import { appTheme } from "@/hooks/theme";
import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/react.query";
import { VerifyUserService } from "@/services/auth.service";
import { useEffect, useState } from "react";

export default function RootLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const authenticateUser = async () => {
      try {
        const isAuthenticated = await VerifyUserService();
        setIsLoggedIn(isAuthenticated);
      } catch (error) {
        console.error("Network error fetching user auth state", error)
        setIsLoggedIn(false)
      }
    }
    authenticateUser();
  }, []);

  return (
    <PaperProvider theme={appTheme}>
      <QueryClientProvider client={queryClient}>
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
            <Stack.Screen name="tabs" />
          </Stack.Protected>
        </Stack>
      </QueryClientProvider>
    </PaperProvider>
  );
}
