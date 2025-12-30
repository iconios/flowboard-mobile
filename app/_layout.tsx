import "react-native-reanimated";
import HeaderTitle from "@/components/stack/headerTitle";
import { appTheme } from "@/hooks/theme";
import { Redirect, Stack, useRouter } from "expo-router";
import { Button, PaperProvider } from "react-native-paper";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/react.query";
import { AuthProvider, useAuth } from "@/hooks/useUserContext";
import { useAppFonts } from "@/hooks/useFonts";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as SplashScreen from "expo-splash-screen";
import { View } from "react-native";
import { useCallback, useEffect, useState } from "react";
import { GetBoardsService } from "@/services/boards.service";

// Initialize splash screen
SplashScreen.preventAutoHideAsync().catch(() => {});

const StackWithGuard = () => {
  const { isLoggedIn, isInitializing, hasSeenCarousel, markCarouselSeen } =
    useAuth();
  const router = useRouter();
  if (isInitializing) return null; // or a splash component
  if (!hasSeenCarousel) return <Redirect href="/value-carousel" />;

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
        <Stack.Screen
          name="value-carousel"
          options={{
            headerShown: true,
            title: "",
            headerRight: () => (
              <Button
                mode="text"
                onPress={async () => {
                  await markCarouselSeen();
                  router.replace("/");
                }}
              >
                Skip
              </Button>
            ),
            gestureEnabled: false,
          }}
        />
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

// Splash screen + prefetch + readiness component
const AppBootstrap = () => {
  const { fontsLoaded, fontError } = useAppFonts();
  const [ready, setReady] = useState(false);
  const { isLoggedIn, isInitializing } = useAuth();

  // Prefetch and cache boards
  useEffect(() => {
    const prepare = async () => {
      if (!isLoggedIn) {
        setReady(true);
        return;
      }

      try {
        await queryClient.prefetchQuery({
          queryKey: ["boards"],
          queryFn: () => GetBoardsService(),
        });
      } catch (e) {
        console.warn(e);
      } finally {
        setReady(true);
      }
    };
    prepare();
  }, [isLoggedIn]);

  const appIsReady = !isInitializing && ready && (fontsLoaded || fontError);
  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      try {
        await SplashScreen.hideAsync();
      } catch {}
    }
  }, [appIsReady]);

  useEffect(() => {
    // Handle font loading errors
    if (fontError) {
      console.log("Error loading fonts");
    }
  }, [fontError]);

  if (!appIsReady) return null;

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <StackWithGuard />
    </View>
  );
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={appTheme}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <AppBootstrap />
          </AuthProvider>
        </QueryClientProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
