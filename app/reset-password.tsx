import {
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "@/hooks/theme";
import { Button, HelperText, TextInput } from "react-native-paper";
import {
  ForgotPasswordSchema,
  ForgotPasswordType,
} from "@/types/forgot-password.types";
import { FormikHelpers, useFormik } from "formik";
import { JSX, useEffect, useState } from "react";
import { NotificationBarType } from "@/types/sign-up.types";
import { toFormikValidationSchema } from "zod-formik-adapter";
import NotificationBar from "@/components/notificationBar";
import { useNavigation } from "expo-router";
import HeaderTitle from "@/components/stack/headerTitle";

const ResetPasswordScreen = () => {
  const theme = useAppTheme();
  const navigation = useNavigation();
  const [notification, setNotification] = useState<NotificationBarType | null>(
    null,
  );
  const [triggerKey, setTriggerKey] = useState(0);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: (props: JSX.IntrinsicAttributes) => (
        <HeaderTitle {...props} />
      ),
      headerStyle: {
        shadowOpacity: 0,
        height: Platform.OS === "ios" ? 120 : 70,
      },
      headerTintColor: "#FF6D00",
    });
  }, [navigation]);

  // Form initial values
  const initialValues = {
    email: "",
  };

  // Form submission handler
  const handleSubmitForm = (
    values: ForgotPasswordType,
    { setSubmitting, resetForm }: FormikHelpers<ForgotPasswordType>,
  ) => {
    setTriggerKey((prev) => prev + 1);
    setNotification({
      message: "handler called",
      messageType: "success",
    });
    resetForm();
    setSubmitting(false);
  };

  // Initialize the formik library
  const formik = useFormik({
    initialValues,
    validationSchema: toFormikValidationSchema(ForgotPasswordSchema),
    onSubmit: handleSubmitForm,
  });

  // Styles object
  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      flex: 1,
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    content: {
      display: "flex",
      justifyContent: "space-between",
    },
    forgotPasswordHeader: {
      justifyContent: "center",
      gap: 10,
      marginBottom: 20,
      marginTop: -15,
    },
    forgotPasswordText: {
      fontFamily: theme.fonts.titleLarge.fontFamily,
      fontSize: theme.fonts.titleLarge.fontSize,
      fontWeight: theme.fonts.titleLarge.fontWeight,
      fontStyle: theme.fonts.titleLarge.fontStyle,
      color: theme.colors.text,
      textAlign: "center",
    },
    bodyText: {
      fontFamily: theme.fonts.bodySmall.fontFamily,
      fontSize: theme.fonts.bodySmall.fontSize,
      fontWeight: theme.fonts.bodySmall.fontWeight,
      fontStyle: theme.fonts.bodySmall.fontStyle,
      color: theme.colors.text,
      textAlign: "center",
    },
    textInput: {
      marginTop: 5,
      backgroundColor: theme.colors.background,
      color: theme.colors.text,
    },
    send: {
      color: theme.colors.custom.light,
      fontFamily: theme.fonts.bodyMedium.fontFamily,
      fontSize: theme.fonts.bodyMedium.fontSize,
      fontWeight: theme.fonts.bodyMedium.fontWeight,
      fontStyle: theme.fonts.bodyMedium.fontStyle,
    },
    sendButton: {
      marginTop: 25,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.forgotPasswordHeader}>
          <Text style={styles.forgotPasswordText}>Forgot your Password?</Text>
          <Text style={styles.bodyText}>
            Please enter your registered email address below to receive the
            reset password link in your e-mailbox
          </Text>
        </View>
        <KeyboardAvoidingView>
          <ScrollView>
            <TextInput
              id="email"
              label="Email"
              value={formik.values.email}
              onChangeText={formik.handleChange("email")}
              onBlur={formik.handleBlur("email")}
              error={formik.touched.email && Boolean(formik.errors.email)}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.textInput}
              mode="outlined"
            />
            {formik.touched.email && !!formik.errors.email && (
              <HelperText
                type="error"
                visible={formik.touched.email && !!formik.errors.email}
              >
                {formik.errors.email}
              </HelperText>
            )}

            <Button
              contentStyle={{ height: 50 }}
              labelStyle={styles.send}
              mode="contained"
              onPress={() => formik.handleSubmit()}
              disabled={formik.isSubmitting}
              style={styles.sendButton}
            >
              Send
            </Button>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>

      {notification && (
        <NotificationBar
          message={notification.message}
          messageType={notification.messageType}
          key={triggerKey}
        />
      )}
    </SafeAreaView>
  );
};
export default ResetPasswordScreen;
