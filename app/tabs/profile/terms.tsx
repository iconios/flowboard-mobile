import { View, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import WebView from "react-native-webview";
import { useAppTheme } from "@/hooks/theme";
import { NotificationBarType } from "@/types/sign-up.types";
import { useState } from "react";
import NotificationBar from "@/components/notificationBar";

const TermsScreen = () => {
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
  const theme = useAppTheme();
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
      justifyContent: "center",
      alignItems: "center",
      display: "flex"
    }
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
          source={{ uri: "https://nerdywebconsults.ng/terms" }}
          onLoad={handleLoad}
          onError={handleError}
        />
      </View>
    </SafeAreaView>
  );
};

export default TermsScreen;
