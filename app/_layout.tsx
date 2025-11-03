import HeaderTitle from "@/components/stack/headerTitle";
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
          headerTitle: (props) => <HeaderTitle {...props} />,
          headerTintColor: "#FF6D00",
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="log-in" options={{ title: "" }} />
        <Stack.Screen name="sign-up" options={{ title: "" }} />
        <Stack.Screen name="reset-password" options={{ title: "" }} />
        <Stack.Screen name="tabs" />
      </Stack>
    </PaperProvider>
  );
}
