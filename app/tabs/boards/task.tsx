import { Text, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "@/hooks/theme";

export default function TaskScreen() {
  const theme = useAppTheme();

  // Styles object
  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      flex: 1,
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    view: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.view}>
        <Text>Task Screen</Text>
      </View>
    </SafeAreaView>
  );
}
