import { StyleSheet, View, Image, Text } from "react-native";
import { Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "@/hooks/theme";
import { useRouter } from "expo-router";

const WelcomeScreen = () => {
  const theme = useAppTheme();
  const router = useRouter();
  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.primary,
      flex: 1,
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    content: {
      flex: 1,
      justifyContent: "space-between",
    },
    header: {
      justifyContent: "center",
      marginTop: 90,
      flexDirection: "row",
    },
    middle: {
      alignItems: "center",
      flex: 1,
      justifyContent: "center",
      gap: 10,
    },
    footer: {
      gap: 16,
      marginBottom: 90,
    },
    logIn: {
      color: theme.colors.background,
      backgroundColor: theme.colors.accent,
      fontFamily: theme.fonts.bodyMedium.fontFamily,
      fontSize: theme.fonts.bodyMedium.fontSize,
      fontWeight: theme.fonts.bodyMedium.fontWeight,
      fontStyle: theme.fonts.bodyMedium.fontStyle,
    },
    signUp: {
      color: theme.colors.accent,
      backgroundColor: theme.colors.background,
      fontFamily: theme.fonts.bodyMedium.fontFamily,
      fontSize: theme.fonts.bodyMedium.fontSize,
      fontWeight: theme.fonts.bodyMedium.fontWeight,
      fontStyle: theme.fonts.bodyMedium.fontStyle,
    },
    welcomeText: {
      fontFamily: theme.fonts.titleLarge.fontFamily,
      fontSize: theme.fonts.titleLarge.fontSize,
      fontWeight: theme.fonts.titleLarge.fontWeight,
      fontStyle: theme.fonts.titleLarge.fontStyle,
      color: theme.colors.custom.light,
      textAlign: "center",
    },
    flowBoardText: {
      fontFamily: theme.fonts.titleSmall.fontFamily,
      fontSize: theme.fonts.titleSmall.fontSize,
      fontWeight: theme.fonts.titleSmall.fontWeight,
      fontStyle: theme.fonts.titleSmall.fontStyle,
      color: theme.colors.custom.light,
      marginLeft: 10,
    },
    bodyText: {
      fontFamily: theme.fonts.bodySmall.fontFamily,
      fontSize: theme.fonts.bodySmall.fontSize,
      fontWeight: theme.fonts.bodySmall.fontWeight,
      fontStyle: theme.fonts.bodySmall.fontStyle,
      color: theme.colors.custom.light,
      textAlign: "center",
    },
    image: {
      width: 60,
      height: 60,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Image
            source={require("../assets/images/logo.png")}
            style={styles.image}
          />
          <Text style={styles.flowBoardText}>FlowBoard</Text>
        </View>
        <View style={styles.middle}>
          <Text style={styles.welcomeText}>Welcome</Text>
          <Text style={styles.bodyText}>Log in or create a new account</Text>
        </View>
        <View style={styles.footer}>
          <Button
            mode="contained"
            labelStyle={styles.logIn}
            contentStyle={{ height: 50 }}
            buttonColor={styles.logIn.backgroundColor}
            accessibilityLabel="Log in button"
            onPress={() => router.push("/log-in")}
          >
            Log in
          </Button>
          <Button
            mode="contained"
            onPress={() => router.push("/sign-up")}
            labelStyle={styles.signUp}
            contentStyle={{ height: 50 }}
            buttonColor={styles.signUp.backgroundColor}
            accessibilityLabel="Sign up button"
          >
            Sign up
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;
