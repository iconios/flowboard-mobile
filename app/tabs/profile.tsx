import { Text, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "@/hooks/theme";
import { Button } from "react-native-paper";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { LogoutService } from "@/services/auth.service";
import { NotificationBarType } from "@/types/sign-up.types";
import NotificationBar from "@/components/notificationBar";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/useUserContext";

export default function ProfileScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const { setIsLoggedIn } = useAuth();
  const [notification, setNotification] = useState<NotificationBarType | null>(
    null,
  );

  const mutation = useMutation({
    mutationKey: ["profile-page"],
    mutationFn: () => LogoutService(),
    onSuccess: () => {
      setNotification({
        message: "Bye!",
        messageType: "success",
      });
      setTimeout(() => {
        setIsLoggedIn(false);
        router.replace("/log-in");
      }, 1200);
    },
    onError: (error) => {
      setNotification({
        message: error.message || "Error logging out",
        messageType: "error",
      });
    },
  });

  const handleLogout = async () => {
    await mutation.mutateAsync();
  };

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
    content: {
      display: "flex",
      justifyContent: "space-between",
    },
    button: {
      marginTop: 20,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      {notification && (
        <NotificationBar
          message={notification.message}
          messageType={notification.messageType}
        />
      )}
      <View style={styles.content}>
        <View>
          <Text>Profile Screen</Text>
        </View>
        <View style={styles.button}>
          <Button mode="outlined" onPress={handleLogout}>
            Log out
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
