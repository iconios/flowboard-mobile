// Component to Delete List
/*
#Plan
1. Accept the list id
2. Confirm that the user wants the list deleted
3. Delete the list
*/

import { NotificationBarType } from "@/types/sign-up.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { StyleSheet, Text } from "react-native";
import { Button, Dialog, Portal } from "react-native-paper";
import NotificationBar from "../notificationBar";
import { useAppTheme } from "@/hooks/theme";
import { DeleteListService } from "@/services/list.service";

const DeleteListDialog = ({
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
    mutationKey: ["delete-list"],
    mutationFn: async (id: string) => await DeleteListService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists"] });
      setNotification({
        message: "List deleted successfully",
        messageType: "success",
      });
      setTimeout(() => onClose(), 1200);
    },
    onError: (error) => {
      setNotification({
        message: error.message || "Failed to delete list",
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
        <Dialog.Title style={styles.titleText}>Delete List</Dialog.Title>
        <Dialog.Content>
          <Text>
            Deleting the List will also delete its tasks, and comments. Are you
            sure you want to delete the list?
          </Text>
        </Dialog.Content>
        <Dialog.Actions style={styles.actions}>
          <Button
            icon="delete"
            onPress={async () => await mutation.mutateAsync(id)}
            disabled={mutation.isPending}
            mode="contained"
            style={styles.primaryButton}
          >
            Proceed
          </Button>
          <Button
            icon="cancel"
            onPress={onClose}
            labelStyle={{ color: theme.colors.accent }}
          >
            Cancel
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default DeleteListDialog;
