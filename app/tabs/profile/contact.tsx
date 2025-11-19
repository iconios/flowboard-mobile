import {
  Text,
  View,
  StyleSheet,
  Alert,
  Linking,
  Pressable,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "@/hooks/theme";
import { useMemo } from "react";
import { Ionicons } from "@expo/vector-icons";

const ContactScreen = () => {
  const theme = useAppTheme();

  // Handler for call button
  const handleCall = async () => {
    try {
      const url = "tel:+2348038399414";
      const supported = await Linking.canOpenURL(url);

      if (!supported) {
        Alert.alert("Error", "Phone calls not supported on this device");
        return;
      }

      await Linking.openURL(url);
    } catch (error) {
      console.error("Error making call", error);
      Alert.alert("Error", "Failed to make phone call");
    }
  };

  // Handler for whatsApp
  const handleWhatsApp = async () => {
    const message = "Hello! I would like to get in touch";
    const phoneNumber = "2348038399414";
    const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    try {
      const supported = await Linking.canOpenURL(url);

      if (!supported) {
        const webUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        await Linking.openURL(webUrl);
        return;
      }

      await Linking.openURL(url);
    } catch (error) {
      console.error("Error sending whatsapp chat", error);
      Alert.alert("Error", "Failed to open whatsApp");
    }
  };

  // Handler for email
  const handleEmail = async () => {
    const email = "info@nerdywebconsults.ng";
    const subject = "Inquiry";
    const body = "Hello, I would like to know more about...";
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    try {
      const supported = await Linking.canOpenURL(url);

      if (!supported) {
        Alert.alert("Error", "No email app found");
        return;
      }

      await Linking.openURL(url);
    } catch (error) {
      console.error("Failed to open email app", error);
      Alert.alert("Error", "Failed to open email app");
    }
  };

  // Styles object
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          justifyContent: "flex-start",
          paddingTop: -30,
        },
        titleText: {
          ...theme.fonts.headlineSmall,
          color: theme.colors.custom.light,
        },
        subtitleText: {
          ...theme.fonts.bodySmall,
          color: theme.colors.custom.light,
        },
        view: {
          height: 120,
          padding: 24,
          justifyContent: "flex-start",
          flexDirection: "row",
          gap: 12,
          marginTop: 8,
        },
        content: {
          flex: 1,
          marginTop: -26,
        },
        titleIcon: {
          flexDirection: "column",
          justifyContent: "flex-start",
          paddingRight: 24,
          paddingBottom: 24,
        },
        title: {
          ...theme.fonts.headlineMedium,
          textAlign: "center",
          fontWeight: "700",
          marginBottom: 16,
        },
      }),
    [theme],
  );
  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.container}>
      <View style={styles.content}>
        <View
          style={[
            styles.view,
            {
              height: 120,
              backgroundColor: theme.colors.primary,
              borderRadius: 0,
            },
          ]}
        >
          <Text
            style={[
              styles.subtitleText,
              { color: theme.colors.custom.light, marginBottom: 16 },
            ]}
          >
            If you have any inquiries, get in touch with us. We will be happy to
            help you.
          </Text>
        </View>
        <Pressable onPress={() => handleWhatsApp()}>
          <View
            style={[
              styles.view,
              {
                height: 100,
                backgroundColor: theme.colors.accent,
                marginHorizontal: 20,
                borderTopLeftRadius: 56,
                borderTopRightRadius: 56,
              },
            ]}
          >
            <Ionicons
              name="chatbubbles-outline"
              size={30}
              color={theme.colors.custom.light}
            />
            <View style={styles.titleIcon}>
              <Text style={styles.titleText}>Chat with us</Text>
              <Text style={styles.subtitleText}>Chat with our assistant</Text>
            </View>
          </View>
        </Pressable>
        <Pressable onPress={() => handleCall()}>
          <View
            style={[
              styles.view,
              {
                backgroundColor: theme.colors.primary,
                marginHorizontal: 20,
                borderBottomLeftRadius: 56,
                borderBottomRightRadius: 56,
              },
            ]}
          >
            <Ionicons
              name="call-outline"
              size={30}
              color={theme.colors.custom.light}
            />
            <View style={styles.titleIcon}>
              <Text style={styles.titleText}>Call us</Text>
              <Text style={styles.subtitleText}>
                We are available from 6AM - 6PM WAT
              </Text>
            </View>
          </View>
        </Pressable>
        <Pressable onPress={() => handleEmail()}>
          <View
            style={[
              styles.view,
              {
                height: Platform.OS === "ios" ? 100 : 120,
                backgroundColor: theme.colors.secondary,
                marginHorizontal: 20,
                borderTopLeftRadius: 56,
                borderTopRightRadius: 56,
              },
            ]}
          >
            <Ionicons
              name="mail-outline"
              size={30}
              color={theme.colors.custom.light}
            />
            <View style={styles.titleIcon}>
              <Text style={styles.titleText}>Email us</Text>
              <Text style={styles.subtitleText}>
                We will get back within 24 hours
              </Text>
            </View>
          </View>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default ContactScreen;
