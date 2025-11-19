import {
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "@/hooks/theme";
import { Button, HelperText, TextInput } from "react-native-paper";
import {
  ForgotPasswordSchema,
  ForgotPasswordType,
} from "@/types/forgot-password.types";
import { FormikHelpers, useFormik } from "formik";
import { useState } from "react";
import { NotificationBarType } from "@/types/sign-up.types";
import { toFormikValidationSchema } from "zod-formik-adapter";
import NotificationBar from "@/components/notificationBar";
import { useMutation } from "@tanstack/react-query";
import { ForgotPasswordService } from "@/services/auth.service";

const ResetPasswordScreen = () => {
  // 1. Initialize all variables and constants
  const theme = useAppTheme();
  const [notification, setNotification] = useState<NotificationBarType | null>(
    null,
  );
  const [triggerKey, setTriggerKey] = useState(0);

  // 2. Mutation library for user forgot-password
  const mutation = useMutation({
    mutationKey: ["user-forgot-password"],
    mutationFn: (values: ForgotPasswordType) => ForgotPasswordService(values),
    onSuccess: (result) => {
      setTriggerKey((prev) => prev + 1);
      setNotification({
        message: result,
        messageType: "success",
      });
      formik.resetForm();
    },
    onError: (error) => {
      setNotification({
        message: error.message || "Failed to log in user",
        messageType: "error",
      });
    },
  });

  // Form initial values
  const initialValues = {
    email: "",
  };

  // Form submission handler
  const handleSubmitForm = async (
    values: ForgotPasswordType,
    { setSubmitting }: FormikHelpers<ForgotPasswordType>,
  ) => {
    try {
      await mutation.mutateAsync(values);
    } catch (error) {
      console.error("Network error during forgot password service", error);
    } finally {
      setSubmitting(false);
    }
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
          <ScrollView keyboardShouldPersistTaps="handled">
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
              onPress={() => {
                Keyboard.dismiss();
                formik.handleSubmit();
              }}
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
