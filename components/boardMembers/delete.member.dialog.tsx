import { useAppTheme } from "@/hooks/theme";
import { NotificationBarType } from "@/types/sign-up.types";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { StyleSheet, Text } from "react-native";
import { Portal, Dialog, Button } from "react-native-paper";
import NotificationBar from "../notificationBar";
import { RemoveBoardMemberService } from "@/services/board.members.service";

const RemoveBoardMember = ({
  memberId,
  boardId,
  onClose,
  dialogOpen,
}: {
  memberId: string;
  boardId: string;
  onClose: () => void;
  dialogOpen: boolean;
}) => {
  const [notification, setNotification] = useState<NotificationBarType | null>(
    null,
  );
  const theme = useAppTheme();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: ["remove-member"],
    mutationFn: async (id: string) => await RemoveBoardMemberService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members", boardId] });
      setNotification({
        message: "Member removed successfully",
        messageType: "success",
      });
      setTimeout(() => onClose(), 1200);
    },
    onError: (error) => {
      setNotification({
        message: error.message || "Failed to remove member",
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
        <Dialog.Title style={styles.titleText}>Remove Member</Dialog.Title>
        <Dialog.Content>
          <Text>
            Are you sure you want to remove the member from this board?
          </Text>
        </Dialog.Content>
        <Dialog.Actions style={styles.actions}>
          <Button
            icon="delete"
            onPress={async () => await mutation.mutateAsync(memberId)}
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

export default RemoveBoardMember;
