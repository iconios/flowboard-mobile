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

export default function ProfileScreen() {
  const theme = useAppTheme();
  const router = useRouter();
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
      router.replace("/log-in");
    },
    onError: (error) => {
      setNotification({
        message: error.message || "Error logging out",
        messageType: "error",
      });
    },
  });

  const handleLogout = async () => {
    await mutation.mutateAsync()
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
  });

  return (
    <SafeAreaView style={styles.container}>
      {notification && (
        <NotificationBar
          message={notification.message}
          messageType={notification.messageType}
        />
      )}
      <View>
        <View style={styles.view}>
          <Text>Profile Screen</Text>
        </View>
        <View>
          <Button mode="outlined" onPress={handleLogout}>
            Log out
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
