import NotificationBar from "@/components/notificationBar";
import { useAppTheme } from "@/hooks/theme";
import { LogInFormSchema, LoginFormType } from "@/types/log-in.types";
import { NotificationBarType } from "@/types/sign-up.types";
import { useNavigation, useRouter } from "expo-router";
import { FormikHelpers, useFormik } from "formik";
import { useEffect, JSX, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  Platform,
} from "react-native";
import { HelperText, TextInput, Button } from "react-native-paper";
import { toFormikValidationSchema } from "zod-formik-adapter";
import HeaderTitle from "@/components/stack/headerTitle";

const LoginScreen = () => {
  const [notification, setNotification] = useState<NotificationBarType | null>(
    null,
  );
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [triggerKey, setTriggerKey] = useState(0);
  const router = useRouter();
  const navigation = useNavigation();
  const theme = useAppTheme();

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

  // Initial values for the form
  const initialValues = {
    email: "",
    password: "",
  };

  // Handler for the form submission
  const handleFormSubmit = (
    values: LoginFormType,
    { resetForm, setSubmitting }: FormikHelpers<LoginFormType>,
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
    validationSchema: toFormikValidationSchema(LogInFormSchema),
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
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logInHeader}>
          <Text style={styles.LogInText}>Log In</Text>
          <Text style={styles.bodyText}>Sign up or Log into your account</Text>
        </View>
        <KeyboardAvoidingView behavior="padding">
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
              onPress={() => formik.handleSubmit()}
              disabled={formik.isSubmitting}
              style={styles.loginButton}
            >
              Log in
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
