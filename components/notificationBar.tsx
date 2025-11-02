import { useEffect, useState } from "react";
import { StyleSheet, Text } from "react-native";
import { Snackbar } from "react-native-paper";
import { useAppTheme } from "@/hooks/theme";
import { NotificationBarType } from "@/types/sign-up.types";

const NotificationBar = ({
  message,
  messageType,
  duration = 4000,
}: NotificationBarType & { duration?: number }) => {
  const [visible, setVisible] = useState(false);
  const theme = useAppTheme();

  useEffect(() => {
    if (message && message.trim() !== "") {
      setVisible(true);
    }
  }, [message]);

  const handleDismiss = () => {
    setVisible(false);
  };

  const styles = StyleSheet.create({
    successSnackbar: {
      backgroundColor: theme.colors.success,
    },
    errorSnackbar: {
      backgroundColor: theme.colors.error,
    },
    snackbarText: {
      color: theme.colors.custom.light,
    },
  });

  if (!message || message.trim() === "") return null;

  return (
    <Snackbar
      visible={visible}
      onDismiss={handleDismiss}
      duration={duration}
      style={
        messageType === "success"
          ? styles.successSnackbar
          : styles.errorSnackbar
      }
      theme={{
        colors: {
          onSurface: theme.colors.custom.light,
          surface:
            messageType === "success"
              ? theme.colors.success
              : theme.colors.error,
        },
      }}
      action={{
        label: "Dismiss",
        onPress: handleDismiss,
      }}
    >
      <Text style={styles.snackbarText}>{message}</Text>
    </Snackbar>
  );
};

export default NotificationBar;
