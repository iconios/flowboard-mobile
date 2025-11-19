import { Stack } from "expo-router";
import { useAppTheme } from "@/hooks/theme";

const ProfileLayout = () => {
  const theme = useAppTheme();
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: theme.colors.primary },
        headerTitleStyle: { color: theme.colors.custom.light },
        headerTintColor: theme.colors.custom.light,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Profile",
        }}
      />
      <Stack.Screen
        name="privacy"
        options={{
          title: "Privacy Policy",
        }}
      />
      <Stack.Screen
        name="terms"
        options={{
          title: "Terms of Service",
        }}
      />
      <Stack.Screen
        name="contact"
        options={{
          title: "Contact Us",
        }}
      />
    </Stack>
  );
};

export default ProfileLayout;
