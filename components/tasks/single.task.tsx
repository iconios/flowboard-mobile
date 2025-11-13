import {
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useAppTheme } from "@/hooks/theme";
import { useCallback, useMemo, useState } from "react";
import { IconButton } from "react-native-paper";
import DeleteTaskDialog from "./delete.task";
import { useRouter } from "expo-router";

const SingleTask = ({
  taskId,
  title,
  position,
  description,
  dueDate,
  priority,
  listId,
}: {
  taskId: string;
  title: string;
  position: number;
  description: string;
  dueDate: string;
  priority: string;
  listId: string;
}) => {
  const theme = useAppTheme();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const router = useRouter();
  const goToTask = useCallback(() => {
    router.push({
      pathname: "/tabs/boards/task/[taskId]",
      params: {
        title,
        description,
        priority,
        position,
        dueDate,
        listId,
        taskId,
      },
    });
  }, [router, title, description, priority, position, dueDate, listId, taskId]);

  const handleDeletePress = useCallback((e: GestureResponderEvent) => {
    e.stopPropagation();
    setOpenDeleteDialog(true);
  }, []);

  const handleDialogClose = useCallback(() => {
    setOpenDeleteDialog(false);
  }, []);

  // Styles object
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          padding: 16,
          backgroundColor: theme.colors.background,
          marginHorizontal: 12,
          marginTop: 12,
          marginBottom: -4,
          borderRadius: 4,
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "row",
        },
        titleText: {
          ...theme.fonts.headlineSmall,
        },
        actions: {
          marginTop: -10,
        },
        textView: {},
      }),
    [theme],
  );

  // Container for each task shown on each list
  return (
    <Pressable onPress={goToTask}>
      <View style={styles.container}>
        <View style={styles.textView}>
          <Text style={styles.titleText}>{title}</Text>
        </View>
        <View style={styles.actions}>
          <IconButton icon="delete" onPress={handleDeletePress} />
        </View>
        {openDeleteDialog && (
          <DeleteTaskDialog
            taskId={taskId}
            listId={listId}
            dialogOpen={openDeleteDialog}
            onClose={handleDialogClose}
          />
        )}
      </View>
    </Pressable>
  );
};

export default SingleTask;
