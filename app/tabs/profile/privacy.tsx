import { View, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import WebView from "react-native-webview";
import { useAppTheme } from "@/hooks/theme";
import { useState } from "react";
import { NotificationBarType } from "@/types/sign-up.types";
import NotificationBar from "@/components/notificationBar";

const PrivacyScreen = () => {
  const theme = useAppTheme();
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<NotificationBarType | null>(
    null,
  );

  const handleLoad = () => {
    setLoading(false);
    setNotification(null);
  };

  const handleError = () => {
    setLoading(false);
    setNotification({
      message: "Failed to load content",
      messageType: "error",
    });
  };

  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: 20,
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingTop: -40,
    },
    webView: {
      flex: 1,
    },
    activityView: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1,
    },
  });
  return (
    <SafeAreaView edges={["top", "right", "left"]} style={styles.container}>
      {loading && (
        <View style={styles.activityView}>
          <ActivityIndicator size="large" />
        </View>
      )}

      {notification && (
        <NotificationBar
          message={notification.message}
          messageType={notification.messageType}
        />
      )}

      <View style={styles.webView}>
        <WebView
          source={{ uri: "https://nerdywebconsults.ng/privacy" }}
          onLoad={handleLoad}
          onError={handleError}
        />
      </View>
    </SafeAreaView>
  );
};

export default PrivacyScreen;
