import { Text, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "@/hooks/theme";
import { useLocalSearchParams } from "expo-router";

export default function TaskScreen() {
  const theme = useAppTheme();

  const { taskId, title, description, priority, position, dueDate, listId } =
    useLocalSearchParams();

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
        <Text>TaskId {taskId}</Text>
        <Text>Title {title}</Text>
        <Text>Description {description}</Text>
        <Text>Priority {priority}</Text>
        <Text>Due Date {dueDate}</Text>
        <Text>Position {position}</Text>
        <Text>ListId {listId}</Text>
      </View>
    </SafeAreaView>
  );
}
