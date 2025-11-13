import NotificationBar from "@/components/notificationBar";
import { useAppTheme } from "@/hooks/theme";
import { LogInFormSchema, LoginFormType } from "@/types/log-in.types";
import { NotificationBarType } from "@/types/sign-up.types";
import { useRouter } from "expo-router";
import { FormikHelpers, useFormik } from "formik";
import { useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  Keyboard,
} from "react-native";
import { HelperText, TextInput, Button } from "react-native-paper";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { useMutation } from "@tanstack/react-query";
import { LoginService } from "@/services/auth.service";
import { useAuth } from "@/hooks/useUserContext";

const LoginScreen = () => {
  // Initialize all variables and constants
  const [notification, setNotification] = useState<NotificationBarType | null>(
    null,
  );
  const { setIsLoggedIn } = useAuth();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [triggerKey, setTriggerKey] = useState(0);
  const router = useRouter();
  const theme = useAppTheme();

  // Mutation library for user log-in
  const mutation = useMutation({
    mutationKey: ["user-login"],
    mutationFn: (values: LoginFormType) => LoginService(values),
    onSuccess: (result) => {
      setTriggerKey((prev) => prev + 1);
      setNotification({
        message: `Welcome ${result.firstname}`,
        messageType: "success",
      });
      formik.resetForm();
      setTimeout(() => {
        setIsLoggedIn(true);
        router.replace("/tabs/boards");
      }, 1200);
    },
    onError: (error) => {
      setNotification({
        message: error.message || "Failed to log in user",
        messageType: "error",
      });
    },
  });

  // Initial values for the form
  const initialValues = {
    email: "",
    password: "",
  };

  // Handler for the form submission
  const handleFormSubmit = async (
    values: LoginFormType,
    { setSubmitting }: FormikHelpers<LoginFormType>,
  ) => {
    try {
      await mutation.mutateAsync(values);
    } catch (error) {
      console.error("Network error while logging in user", error);
    } finally {
      setSubmitting(false);
    }
  };

  // Initialize the formik library
  const formik = useFormik({
    initialValues,
    validationSchema: toFormikValidationSchema(LogInFormSchema),
    onSubmit: handleFormSubmit,
  });

  // Styles object
  const styles = useMemo(
    () =>
      StyleSheet.create({
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
        logInHeader: {
          justifyContent: "center",
          gap: 10,
          marginBottom: 20,
          marginTop: -15,
        },
        textInput: {
          marginTop: 5,
          backgroundColor: theme.colors.background,
          color: theme.colors.text,
        },
        footer: {
          display: "flex",
          flexDirection: "row",
          marginTop: 25,
          justifyContent: "center",
        },
        signUp: {
          color: theme.colors.custom.light,
          fontFamily: theme.fonts.bodyMedium.fontFamily,
          fontSize: theme.fonts.bodyMedium.fontSize,
          fontWeight: theme.fonts.bodyMedium.fontWeight,
          fontStyle: theme.fonts.bodyMedium.fontStyle,
        },
        login: {
          marginTop: -1,
          marginLeft: 3,
        },
        LogInText: {
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
        loginButton: {
          marginTop: 15,
        },
        forgotPassword: {
          display: "flex",
          justifyContent: "flex-end",
          flexDirection: "row",
          marginTop: 5,
          marginRight: -9,
        },
      }),
    [theme],
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logInHeader}>
          <Text style={styles.LogInText}>Log In</Text>
          <Text style={styles.bodyText}>Sign up or Log into your account</Text>
        </View>
        <KeyboardAvoidingView behavior="padding">
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

            <TextInput
              id="password"
              label="Password"
              value={formik.values.password}
              onChangeText={formik.handleChange("password")}
              onBlur={formik.handleBlur("password")}
              error={formik.touched.password && Boolean(formik.errors.password)}
              style={styles.textInput}
              mode="outlined"
              secureTextEntry={!isPasswordVisible}
              right={
                <TextInput.Icon
                  icon={isPasswordVisible ? "eye-off" : "eye"}
                  onPress={() => {
                    setIsPasswordVisible(!isPasswordVisible);
                  }}
                />
              }
            />
            {formik.touched.password && !!formik.errors.password && (
              <HelperText
                type="error"
                visible={formik.touched.password && !!formik.errors.password}
              >
                {formik.errors.password}
              </HelperText>
            )}

            <View style={styles.forgotPassword}>
              <Button
                mode="text"
                onPress={() => router.push("/reset-password")}
              >
                Forgot Password?
              </Button>
            </View>

            <Button
              contentStyle={{ height: 50 }}
              labelStyle={styles.signUp}
              mode="contained"
              onPress={() => {
                Keyboard.dismiss();
                formik.handleSubmit();
              }}
              disabled={formik.isSubmitting || mutation.isPending}
              style={styles.loginButton}
            >
              {mutation.isPending ? "Logging in" : "Log in"}
            </Button>
            <View style={styles.footer}>
              <Text>You do not have an account?</Text>
              <Button
                mode="text"
                onPress={() => router.push("/sign-up")}
                labelStyle={styles.login}
              >
                Sign up
              </Button>
            </View>
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

export default LoginScreen;
