import { useAppTheme } from "@/hooks/theme";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { Button, Checkbox, HelperText, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { FormikHelpers, useFormik } from "formik";
import {
  NotificationBarType,
  SignUpFormSchema,
  SignUpFormType,
} from "@/types/sign-up.types";
import { useRouter } from "expo-router";
import { useState } from "react";
import { toFormikValidationSchema } from "zod-formik-adapter";
import NotificationBar from "@/components/notificationBar";
import { useMutation } from "@tanstack/react-query";
import { RegisterAccountService } from "@/services/auth.service";
import { RegisterAccountType } from "@/types/auth.types";

const SignUpScreen = () => {
  // Initialize all variables and constants
  const [checked, setChecked] = useState(false);
  const [notification, setNotification] = useState<NotificationBarType | null>(
    null,
  );
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [triggerKey, setTriggerKey] = useState(0);
  const router = useRouter();
  const theme = useAppTheme();

  // Mutation library for new user registration
  const mutation = useMutation({
    mutationKey: ["sign-up"],
    mutationFn: (values: RegisterAccountType) => RegisterAccountService(values),
    onSuccess: (result) => {
      setTriggerKey((prev) => prev + 1);
      setNotification({
        message: result.message,
        messageType: "success",
      });
      formik.resetForm();
      setChecked(false);
    },
    onError: (error) => {
      setNotification({
        message: error.message || "Failed to register user",
        messageType: "error",
      });
    },
  });

  // Initial values for the form
  const initialValues = {
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  // Handler for the form submission
  const handleFormSubmit = async (
    values: SignUpFormType,
    { setSubmitting }: FormikHelpers<SignUpFormType>,
  ) => {
    const { confirmPassword, ...userData } = values;
    try {
      await mutation.mutateAsync(userData);
    } catch (error) {
      console.error("Network error while registering user", error);
    } finally {
      setSubmitting(false);
    }
  };

  // Initialize the formik library
  const formik = useFormik({
    initialValues,
    validationSchema: toFormikValidationSchema(SignUpFormSchema),
    onSubmit: handleFormSubmit,
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
    signUpHeader: {
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
      marginLeft: 0,
    },
    signUpText: {
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
    agree: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 10,
      marginBottom: 10,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Container for the Sign up heading and subtitle */}
        <View style={styles.signUpHeader}>
          <Text style={styles.signUpText}>Sign Up</Text>
          <Text style={styles.bodyText}>Log in or create a new account</Text>
        </View>

        {/* Container for the sign up form fields and buttons */}
        <KeyboardAvoidingView behavior="padding">
          <ScrollView>
            <TextInput
              id="firstname"
              label="Firstname"
              value={formik.values.firstname}
              onChangeText={formik.handleChange("firstname")}
              onBlur={formik.handleBlur("firstname")}
              error={
                formik.touched.firstname && Boolean(formik.errors.firstname)
              }
              aria-label="firstname text input field"
              style={styles.textInput}
              mode="outlined"
            />
            {formik.touched.firstname && !!formik.errors.firstname && (
              <HelperText
                type="error"
                visible={formik.touched.firstname && !!formik.errors.firstname}
              >
                {formik.errors.firstname}
              </HelperText>
            )}

            <TextInput
              id="lastname"
              label="Lastname"
              value={formik.values.lastname}
              onChangeText={formik.handleChange("lastname")}
              onBlur={formik.handleBlur("lastname")}
              error={formik.touched.lastname && Boolean(formik.errors.lastname)}
              style={styles.textInput}
              mode="outlined"
            />
            {formik.touched.lastname && !!formik.errors.lastname && (
              <HelperText
                type="error"
                visible={formik.touched.lastname && !!formik.errors.lastname}
              >
                {formik.errors.lastname}
              </HelperText>
            )}

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
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)}
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

            <TextInput
              id="confirmPassword"
              label="Confirm Password"
              value={formik.values.confirmPassword}
              onChangeText={formik.handleChange("confirmPassword")}
              onBlur={formik.handleBlur("confirmPassword")}
              error={
                formik.touched.confirmPassword &&
                Boolean(formik.errors.confirmPassword)
              }
              style={styles.textInput}
              mode="outlined"
              secureTextEntry={!isConfirmPasswordVisible}
              right={
                <TextInput.Icon
                  icon={isConfirmPasswordVisible ? "eye-off" : "eye"}
                  onPress={() =>
                    setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
                  }
                />
              }
            />
            {formik.touched.confirmPassword &&
              !!formik.errors.confirmPassword && (
                <HelperText
                  type="error"
                  visible={
                    formik.touched.confirmPassword &&
                    !!formik.errors.confirmPassword
                  }
                >
                  {formik.errors.confirmPassword}
                </HelperText>
              )}

            <View style={styles.agree}>
              <Checkbox
                status={checked ? "checked" : "unchecked"}
                onPress={() => setChecked(!checked)}
              />
              <Text style={{ flexWrap: "wrap", flexShrink: 1 }}>
                I agree to the Terms of Service and Privacy Policy
              </Text>
            </View>
            <Button
              contentStyle={{ height: 50 }}
              labelStyle={styles.signUp}
              mode="contained"
              onPress={() => formik.handleSubmit()}
              disabled={formik.isSubmitting || !checked}
            >
              Sign up
            </Button>
            <View style={styles.footer}>
              <Text>Already have an account?</Text>
              <Button
                mode="text"
                onPress={() => router.push("/log-in")}
                labelStyle={styles.login}
              >
                Log in
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

export default SignUpScreen;
