// Component to Delete Task
/*
#Plan
1. Accept the task id
2. Confirm that the user wants the task deleted
3. Delete the task
*/

import { useAppTheme } from "@/hooks/theme";
import { NotificationBarType } from "@/types/sign-up.types";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { StyleSheet, Text } from "react-native";
import { Portal, Dialog, Button } from "react-native-paper";
import NotificationBar from "../notificationBar";
import { DeleteTaskService } from "@/services/tasks.service";

const DeleteTaskDialog = ({
  taskId,
  dialogOpen,
  onClose,
  listId,
}: {
  taskId: string;
  listId: string;
  dialogOpen: boolean;
  onClose: () => void;
}) => {
  const [notification, setNotification] = useState<NotificationBarType | null>(
    null,
  );
  const theme = useAppTheme();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: ["delete-task"],
    mutationFn: async (id: string) => await DeleteTaskService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", listId] });
      setNotification({
        message: "Task deleted successfully",
        messageType: "success",
      });
      setTimeout(() => onClose(), 1200);
    },
    onError: (error) => {
      setNotification({
        message: error.message || "Failed to delete task",
        messageType: "error",
      });
    },
  });

  const styles = StyleSheet.create({
    container: {
      borderRadius: 1,
    },
    titleText: {
      ...theme.fonts.headlineSmall,
      textAlign: "center",
    },
    actions: {
      display: "flex",
      justifyContent: "space-between",
    },
    primaryButton: {
      paddingHorizontal: 4,
      borderRadius: 1,
    },
  });
  return (
    <Portal>
      {notification && (
        <NotificationBar
          message={notification.message}
          messageType={notification.messageType}
        />
      )}
      <Dialog visible={dialogOpen} onDismiss={onClose} style={styles.container}>
        <Dialog.Title style={styles.titleText}>Delete Task</Dialog.Title>
        <Dialog.Content>
          <Text>
            Deleting the Task will also delete its comments. Are you sure you
            want to delete the task?
          </Text>
        </Dialog.Content>
        <Dialog.Actions style={styles.actions}>
          <Button
            icon="delete"
            onPress={async () => await mutation.mutateAsync(taskId)}
            disabled={mutation.isPending}
          >
            Proceed
          </Button>
          <Button
            icon="cancel"
            onPress={onClose}
            mode="contained"
            style={styles.primaryButton}
          >
            Cancel
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default DeleteTaskDialog;
