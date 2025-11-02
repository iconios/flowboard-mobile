import { appTheme } from "@/hooks/theme";
import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";

export default function RootLayout() {
  return (
    <PaperProvider theme={appTheme}>
      <Stack
        screenOptions={{
          headerShown: true,
          animation: "slide_from_right",
          gestureEnabled: true,
          gestureDirection: "horizontal",
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="log-in" />
        <Stack.Screen name="sign-up" />
        <Stack.Screen name="reset-password" />
        <Stack.Screen name="tabs" />
      </Stack>
    </PaperProvider>
  );
}
