import { Text, View, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "@/hooks/theme";
import { Avatar, Button } from "react-native-paper";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { GetUserDataService, LogoutService } from "@/services/auth.service";
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
  const [user, setUser] = useState({
    firstname: "",
    email: "",
  });

  useEffect(() => {
    const getUserData = async () => {
      const userData = await GetUserDataService();
      if (!userData) return;
      setUser({
        firstname: userData.firstname,
        email: userData.email,
      });
    };
    getUserData();
  }, []);

  const firstAlphabet = user.firstname[0];
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
      paddingTop: -24,
    },
    view: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    content: {
      flex: 1,
      justifyContent: "flex-start",
      marginTop: 0,
    },
    button: {
      marginTop: 24,
    },
    profileHeader: {
      justifyContent: "center",
      alignItems: "center",
      paddingBottom: 24,
    },
    userName: {
      ...theme.fonts.headlineSmall,
      textAlign: "center",
      paddingTop: 12,
    },
    userEmail: {
      ...theme.fonts.bodySmall,
      textAlign: "center",
      fontWeight: "100",
    },
    textItem: {
      borderTopColor: "grey",
      borderLeftColor: "grey",
      borderRightColor: "grey",
      borderBottomColor: "white",
      borderWidth: 1,
      borderStyle: "solid",
      padding: 10,
      ...theme.fonts.bodyMedium,
      borderRadius: 4,
      color: theme.colors.primary,
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={["top", "right", "left"]}>
      {notification && (
        <NotificationBar
          message={notification.message}
          messageType={notification.messageType}
        />
      )}
      <View style={styles.content}>
        <View style={styles.profileHeader}>
          <Avatar.Text
            label={firstAlphabet}
            size={95}
            style={{ backgroundColor: "grey" }}
            color={theme.colors.custom.light}
          />
          <Text style={styles.userName}>{user.firstname}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>
        <View>
          <Pressable onPress={() => router.push("/tabs/profile/contact")}>
            <Text style={styles.textItem}>Contact Us</Text>
          </Pressable>
          <Pressable onPress={() => router.push("/tabs/profile/privacy")}>
            <Text style={styles.textItem}>Privacy Policy</Text>
          </Pressable>
          <Pressable onPress={() => router.push("/tabs/profile/terms")}>
            <Text style={styles.textItem}>Terms of Service</Text>
          </Pressable>
          <Pressable>
            <Text
              style={[
                styles.textItem,
                {
                  borderBottomColor: "grey",
                },
              ]}
            >
              Delete Account
            </Text>
          </Pressable>
        </View>
        <View style={styles.button}>
          <Button
            mode="contained"
            onPress={handleLogout}
            contentStyle={{ height: 48 }}
            labelStyle={{ ...theme.fonts.bodyMedium }}
          >
            Log out
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
