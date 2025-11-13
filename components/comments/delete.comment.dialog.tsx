import { useAppTheme } from "@/hooks/theme";
import { NotificationBarType } from "@/types/sign-up.types";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Text, StyleSheet } from "react-native";
import { Portal, Dialog, Button } from "react-native-paper";
import NotificationBar from "../notificationBar";
import { DeleteCommentService } from "@/services/comment.service";

const DeleteCommentDialog = ({
  commentId,
  taskId,
  dialogOpen,
  onClose,
}: {
  commentId: string;
  taskId: string;
  dialogOpen: boolean;
  onClose: () => void;
}) => {
  const [notification, setNotification] = useState<NotificationBarType | null>(
    null,
  );
  const theme = useAppTheme();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: ["delete-comment"],
    mutationFn: async (id: string) => await DeleteCommentService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", taskId] });
      setNotification({
        message: "Comment deleted successfully",
        messageType: "success",
      });
      setTimeout(() => onClose(), 1200);
    },
    onError: (error) => {
      setNotification({
        message: error.message || "Failed to delete comment",
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
        <Dialog.Title style={styles.titleText}>Delete Comment</Dialog.Title>
        <Dialog.Content>
          <Text>
            This action cannot be undone. Are you sure you want to delete the
            comment?
          </Text>
        </Dialog.Content>
        <Dialog.Actions style={styles.actions}>
          <Button
            icon="delete"
            onPress={async () => await mutation.mutateAsync(commentId)}
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

export default DeleteCommentDialog;
