import { Tabs } from "expo-router";

const TabLayout = () => {
  <Tabs>
    <Tabs.Screen name="index" options={{ title: "Home" }} />
    <Tabs.Screen name="boards" options={{ title: "Boards" }} />
  </Tabs>;
};

export default TabLayout;
