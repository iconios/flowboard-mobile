import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import WebView from "react-native-webview";
import { useAppTheme } from "@/hooks/theme";

const TermsScreen = () => {
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
  });
  return (
    <SafeAreaView edges={["top", "right", "left"]} style={styles.container}>
      <View style={styles.webView}>
        <WebView source={{ uri: "https://nerdywebconsults.ng/terms" }} />
      </View>
    </SafeAreaView>
  );
};

export default TermsScreen;
