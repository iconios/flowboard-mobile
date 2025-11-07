import { Stack } from "expo-router";
import { useAppTheme } from "@/hooks/theme";

const BoardsLayout = () => {
  const theme = useAppTheme();
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: theme.colors.primary },
        headerTitleStyle: { color: "white" },
        headerTintColor: "white",
      }}
    >
      <Stack.Screen name="index" options={{ title: "My Boards" }} />
      <Stack.Screen name="lists" options={{ title: "Lists" }} />
      <Stack.Screen name="task" options={{ title: "Task" }} />
    </Stack>
  );
};

export default BoardsLayout;
