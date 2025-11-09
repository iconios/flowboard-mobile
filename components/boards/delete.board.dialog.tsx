// Component to Delete Board
/*
#Plan
1. Accept the board id
2. Confirm that the user wants the board deleted
3. Delete the board
*/

import { DeleteBoardService } from "@/services/boards.service";
import { NotificationBarType } from "@/types/sign-up.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { StyleSheet, Text } from "react-native";
import { Button, Dialog, Portal } from "react-native-paper";
import NotificationBar from "../notificationBar";
import { useAppTheme } from "@/hooks/theme";

const DeleteBoardDialog = ({
  id,
  dialogOpen,
  onClose,
}: {
  id: string;
  dialogOpen: boolean;
  onClose: () => void;
}) => {
  const [notification, setNotification] = useState<NotificationBarType | null>(
    null,
  );
  const theme = useAppTheme();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: ["delete-board"],
    mutationFn: async (id: string) => await DeleteBoardService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
      setNotification({
        message: "Board deleted successfully",
        messageType: "success",
      });
      setTimeout(() => onClose(), 1200);
    },
    onError: (error) => {
      setNotification({
        message: error.message || "Failed to delete board",
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
        <Dialog.Title style={styles.titleText}>Delete Board</Dialog.Title>
        <Dialog.Content>
          <Text>
            Deleting the board will also delete its lists, tasks, and comments.
            Are you sure you want to delete the board?
          </Text>
        </Dialog.Content>
        <Dialog.Actions style={styles.actions}>
          <Button
            icon="delete"
            onPress={async () => await mutation.mutateAsync(id)}
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

export default DeleteBoardDialog;
