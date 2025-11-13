import {
  Keyboard,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "@/hooks/theme";
import { useLocalSearchParams } from "expo-router";
import ShowSingleTask from "@/components/tasks/show.single.task";

export default function TaskScreen() {
  const theme = useAppTheme();

  const { taskId, title, description, priority, position, dueDate, listId } =
    useLocalSearchParams();

  // Styles object
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 0,
      marginTop: 0,
      backgroundColor: theme.colors.primary,
    },
    view: {
      // Position from bottom
      position: "absolute",
      bottom: 0,
      // Fill 80% from bottom
      height: 650,
      minWidth: "100%",
      // Content styling
      borderTopStartRadius: Platform.OS === "ios" ? 30 : 90,
      borderTopEndRadius: Platform.OS === "ios" ? 30 : 90,
      paddingTop: Platform.OS === "ios" ? 35 : 60,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 20,
      backgroundColor: theme.colors.secondary,
    },
  });

  const stringPosition = position as string;
  const numberPosition = Number.parseInt(stringPosition, 10);
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.container}>
        <View style={styles.view}>
          <ShowSingleTask
            id={taskId as string}
            title={title as string}
            description={description as string}
            dueDate={dueDate as string}
            priority={priority as string}
            position={numberPosition}
            listId={listId as string}
          />
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
