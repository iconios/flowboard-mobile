import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "@/hooks/theme";

const TabLayout = () => {
  const theme = useAppTheme();
  return (
    <Tabs
      screenOptions={{
        tabBarLabelPosition: "below-icon",
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="boards"
        options={{
          tabBarLabel: "Boards",
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "briefcase" : "briefcase-outline"}
              size={size}
              color={color}
            />
          ),
          tabBarActiveTintColor: theme.colors.primary,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: "Profile",
          title: "Profile",
          headerShown: true,
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "person-circle" : "person-circle-outline"}
              size={size}
              color={color}
            />
          ),
          tabBarActiveTintColor: theme.colors.primary,
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
