import { useAppTheme } from "@/hooks/theme";
import { NotificationBarType } from "@/types/sign-up.types";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Text, StyleSheet } from "react-native";
import { Portal, Dialog, Button } from "react-native-paper";
import NotificationBar from "../notificationBar";
import { DeleteUserService } from "@/services/user.service";
import { useAuth } from "@/hooks/useUserContext";
import { LogoutService } from "@/services/auth.service";
import { useRouter } from "expo-router";

const DeleteUserDialog = ({
  dialogOpen,
  onClose,
}: {
  dialogOpen: boolean;
  onClose: () => void;
}) => {
  const [notification, setNotification] = useState<NotificationBarType | null>(
    null,
  );
  const { setIsLoggedIn } = useAuth();
  const router = useRouter();
  const theme = useAppTheme();
  const mutation = useMutation({
    mutationKey: ["delete-user"],
    mutationFn: async () => await DeleteUserService(),
    onSuccess: async () => {
      setNotification({
        message: "Account deleted successfully",
        messageType: "success",
      });
      await LogoutService();
      setTimeout(() => {
        onClose();
        setIsLoggedIn(false);
        router.replace("/log-in");
      }, 1200);
    },
    onError: (error) => {
      setNotification({
        message: error.message || "Failed to delete account",
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
        <Dialog.Title style={styles.titleText}>Delete Account</Dialog.Title>
        <Dialog.Content>
          <Text>
            This action cannot be undone. Deleting your account will delete all data
            associated with your account. Are you sure you want to delete your user
            account?
          </Text>
        </Dialog.Content>
        <Dialog.Actions style={styles.actions}>
          <Button
            icon="delete"
            onPress={async () => await mutation.mutateAsync()}
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

export default DeleteUserDialog;
