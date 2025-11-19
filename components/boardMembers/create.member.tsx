// Create Board Member Component

import {
  CreateMemberFormType,
  CreateMemberFormSchema,
} from "@/types/members.types";
import { FormikHelpers, useFormik } from "formik";
import { useEffect, useMemo, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Modal,
  FlatList,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Button, HelperText, TextInput } from "react-native-paper";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { useAppTheme } from "@/hooks/theme";
import { useMutation } from "@tanstack/react-query";
import { CreateBoardMemberService } from "@/services/board.members.service";
import { NotificationBarType } from "@/types/sign-up.types";
import NotificationBar from "../notificationBar";
import { GetUserDataService } from "@/services/auth.service";

const CreateBoardMember = ({
  boardId,
  ownerId,
}: {
  boardId: string;
  ownerId: string;
}) => {
  // Initialize all the required variables and constants
  const theme = useAppTheme();
  const [roleModal, setRoleModal] = useState(false);
  const [notification, setNotification] = useState<NotificationBarType | null>(
    null,
  );
  const [userId, setUserId] = useState("");
  useEffect(() => {
    const getUserId = async () => {
      const userData = await GetUserDataService();
      if (!userData?.id) return;
      setUserId(userData.id);
    };
    getUserId();
  }, []);
  console.log("UserId in CreateMember", userId);
  console.log("Owner Id in CreateMember", ownerId);

  const initialValues = {
    userEmail: "",
    role: "",
  };

  const options = [
    { id: "1", label: "Member", value: "member" },
    { id: "2", label: "Admin", value: "admin" },
  ];

  // React query useMutation initialization and implementation
  const mutation = useMutation({
    mutationKey: ["invite-member"],
    mutationFn: async (values: CreateMemberFormType & { board_id: string }) =>
      await CreateBoardMemberService(values),
    onSuccess: (result) => {
      setNotification({
        message: `${result.message}`,
        messageType: "success",
      });
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to send invite";
      setNotification({
        message: errorMessage,
        messageType: "error",
      });
    },
  });

  // Handler for the form submission to create a board member
  const handleFormSubmit = async (
    values: CreateMemberFormType,
    { setSubmitting }: FormikHelpers<CreateMemberFormType>,
  ) => {
    try {
      const submitData = {
        ...values,
        board_id: boardId,
      };
      console.log(submitData);
      await mutation.mutateAsync(submitData);
    } finally {
      setSubmitting(false);
    }
  };

  // Initialize and implement the formik library
  const formik = useFormik({
    initialValues,
    validationSchema: toFormikValidationSchema(CreateMemberFormSchema),
    onSubmit: handleFormSubmit,
  });

  // Styles object
  const styles = useMemo(
    () =>
      StyleSheet.create({
        textInput: {
          backgroundColor: theme.colors.background,
          color: theme.colors.text,
          marginBottom: 10,
          ...theme.fonts.bodyMedium,
        },
        actions: {
          flexDirection: "row",
          gap: 12,
          marginTop: 16,
          justifyContent: "space-between",
        },
        titleText: {
          ...theme.fonts.headlineSmall,
          marginBottom: 16,
          textAlign: "center",
          marginTop: 20,
        },
        subtitle: {
          ...theme.fonts.bodySmall,
          textAlign: "center",
          marginBottom: 16,
        },
        formContainer: {
          flex: 1,
          backgroundColor: theme.colors.background,
          padding: 16,
          justifyContent: "center",
        },
        container: {
          marginTop: 10,
          paddingTop: 0,
          height: 370,
          backgroundColor: theme.colors.background,
          paddingHorizontal: 10,
          borderRadius: 10,
          elevation: 8,
          shadowColor: "#000012",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
        },
        button: {
          borderRadius: 24,
          borderWidth: 1,
          borderColor: formik.values.userEmail ? theme.colors.primary : "grey",
          borderStyle: "solid",
          marginTop: 24,
          height: 48,
        },
        // Styles for the role modal
        roleModalOverlay: {
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          justifyContent: "center",
          padding: 20,
        },
        roleModalContent: {
          backgroundColor: "white",
          borderRadius: 8,
          padding: 16,
          maxHeight: "60%",
        },
        roleModalHeader: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        },
      }),
    [theme, formik.values.userEmail],
  );

  return (
    <View style={styles.container}>
      {notification && (
        <NotificationBar
          message={notification.message}
          messageType={notification.messageType}
        />
      )}
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View>
          <View>
            <Text style={styles.titleText}>Invite to Board</Text>
            <Text style={styles.subtitle}>
              Enter the email of the user you would want to invite to this
              board.
            </Text>
          </View>
          <View>
            <TextInput
              id="userEmail"
              label="Email"
              placeholder="Enter email address"
              value={formik.values.userEmail}
              onChangeText={formik.handleChange("userEmail")}
              onBlur={formik.handleBlur("userEmail")}
              error={
                formik.touched.userEmail && Boolean(formik.errors.userEmail)
              }
              autoCapitalize="none"
              style={styles.textInput}
              mode="outlined"
              disabled={userId !== ownerId}
            />
            {formik.touched.userEmail && !!formik.errors.userEmail && (
              <HelperText
                type="error"
                visible={formik.touched.userEmail && !!formik.errors.userEmail}
              >
                {formik.errors.userEmail}
              </HelperText>
            )}

            {/* Role field */}
            <View>
              <TextInput
                label="Select Role"
                value={formik.values.role}
                showSoftInputOnFocus={false}
                caretHidden={true}
                disabled={userId !== ownerId}
                onPress={() => setRoleModal(true)}
                right={
                  <TextInput.Icon
                    icon="chevron-down"
                    onPress={() => setRoleModal(true)}
                    disabled={userId !== ownerId}
                  />
                }
              />

              {/* Role Selection Modal */}
              <Modal
                visible={roleModal && userId === ownerId}
                animationType="slide"
                transparent={true}
              >
                <View style={styles.roleModalOverlay}>
                  <View style={styles.roleModalContent}>
                    <View style={styles.roleModalHeader}>
                      <Text>Select role</Text>
                      <Button onPress={() => setRoleModal(false)}>Close</Button>
                    </View>

                    <FlatList
                      data={options}
                      keyExtractor={(item) => item.id}
                      renderItem={({ item }) => (
                        <Pressable
                          style={{
                            padding: 16,
                            backgroundColor:
                              formik.values.role === item.value
                                ? "#e3f2fd"
                                : "white",
                            borderBottomWidth: 1,
                            borderBottomColor: "#f0f0f0",
                          }}
                          onPress={() => {
                            formik.setFieldValue("role", item.value);
                            setRoleModal(false);
                          }}
                          disabled={userId !== ownerId}
                        >
                          <Text>{item.label}</Text>
                        </Pressable>
                      )}
                    />
                  </View>
                </View>
              </Modal>
            </View>
            <Button
              mode="contained"
              icon="send"
              style={styles.button}
              labelStyle={{
                ...theme.fonts.labelLarge,
                paddingVertical: 3,
              }}
              contentStyle={{
                backgroundColor: formik.values.userEmail
                  ? theme.colors.primary
                  : "grey",
              }}
              disabled={!formik.values.userEmail || userId !== ownerId}
              onPress={() => formik.handleSubmit()}
            >
              Send Invite
            </Button>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default CreateBoardMember;
