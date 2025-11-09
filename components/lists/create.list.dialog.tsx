import {
  FlatList,
  Keyboard,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Button, HelperText, TextInput, Text } from "react-native-paper";
import { FormikHelpers, useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import {
  CreateListFormInputSchema,
  CreateListFormInputType,
} from "@/types/list.types";
import { useAppTheme } from "@/hooks/theme";
import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateListService } from "@/services/list.service";
import { NotificationBarType } from "@/types/sign-up.types";
import NotificationBar from "../notificationBar";

const CreateListDialog = ({
  dialogOpen,
  onClose,
  boardId,
  onSuccess,
}: {
  dialogOpen: boolean;
  onClose: () => void;
  boardId: string;
  onSuccess: (v: string) => void;
}) => {
  const theme = useAppTheme();
  const queryClient = useQueryClient();
  const [statusModal, setStatusModal] = useState(false);
  const [notification, setNotification] = useState<NotificationBarType | null>(
    null,
  );
  const options = [
    {
      id: "1",
      label: "Active",
      value: "active",
    },
    {
      id: "2",
      label: "Archive",
      value: "archive",
    },
  ];
  const initialValues = {
    title: "",
    position: "0",
    status: "active",
  };

  const mutation = useMutation({
    mutationKey: ["create-list", boardId],
    mutationFn: async (values: {
      title: string;
      position: number;
      status: string;
      boardId: string;
    }) => await CreateListService(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists"] });
      formik.resetForm();
      onSuccess("List created successfully");
      onClose();
    },
    onError: (error) => {
      setNotification({
        message: error.message || "Failed to create list",
        messageType: "error",
      });
    },
  });

  const handleFormSubmit = async (
    values: CreateListFormInputType,
    { setSubmitting }: FormikHelpers<CreateListFormInputType>,
  ) => {
    try {
      const submitData = {
        ...values,
        position: Number.parseInt(values.position, 10),
        title: values.title.trim(),
        boardId,
      };
      await mutation.mutateAsync(submitData);
    } catch (error) {
      console.error("Error submitting form", error);
    } finally {
      setSubmitting(false);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema: toFormikValidationSchema(CreateListFormInputSchema),
    onSubmit: handleFormSubmit,
  });

  // Styles object
  const styles = useMemo(
    () =>
      StyleSheet.create({
        // Modal overlay
        modalOverlay: {
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        },
        // Modal content container
        modalContent: {
          backgroundColor: theme.colors.surface,
          borderRadius: 8,
          padding: 20,
          width: "100%",
          maxWidth: 400,
          // Key properties for content-based height
          alignSelf: "center",
        },
        textInput: {
          backgroundColor: theme.colors.background,
          color: theme.colors.text,
          marginBottom: 10,
          ...theme.fonts.bodyMedium,
        },
        primaryButton: {
          paddingHorizontal: 4,
          borderRadius: 1,
        },
        actions: {
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 16,
        },
        titleText: {
          ...theme.fonts.headlineSmall,
          textAlign: "center",
          marginBottom: 16,
        },
        // Styles for the status modal
        statusModalOverlay: {
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          justifyContent: "center",
          padding: 20,
        },
        statusModalContent: {
          backgroundColor: "white",
          borderRadius: 8,
          padding: 16,
          maxHeight: "60%",
        },
        statusModalHeader: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        },
      }),
    [theme],
  );

  return (
    <Modal
      visible={dialogOpen}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      {notification && (
        <NotificationBar
          message={notification.message}
          messageType={notification.messageType}
        />
      )}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Title */}
            <Text style={styles.titleText}>Create a List</Text>

            {/* Form Content */}
            <View>
              <TextInput
                id="title"
                label="Title"
                value={formik.values.title}
                onChangeText={formik.handleChange("title")}
                onBlur={formik.handleBlur("title")}
                error={formik.touched.title && Boolean(formik.errors.title)}
                autoCapitalize="none"
                style={styles.textInput}
                mode="outlined"
              />
              {formik.touched.title && !!formik.errors.title && (
                <HelperText
                  type="error"
                  visible={formik.touched.title && !!formik.errors.title}
                >
                  {formik.errors.title}
                </HelperText>
              )}

              <TextInput
                id="position"
                label="Position"
                value={formik.values.position}
                onChangeText={formik.handleChange("position")}
                onBlur={formik.handleBlur("position")}
                error={
                  formik.touched.position && Boolean(formik.errors.position)
                }
                style={styles.textInput}
                keyboardType="numeric"
                mode="outlined"
              />
              {formik.touched.position && !!formik.errors.position && (
                <HelperText
                  type="error"
                  visible={formik.touched.position && !!formik.errors.position}
                >
                  {formik.errors.position}
                </HelperText>
              )}

              {/* Status Selector */}
              <View>
                <TextInput
                  label="Select status"
                  value={formik.values.status}
                  showSoftInputOnFocus={false}
                  caretHidden={true}
                  onPressIn={() => setStatusModal(true)}
                  right={<TextInput.Icon icon="chevron-down" />}
                />

                {/* Status Selection Modal */}
                <Modal
                  visible={statusModal}
                  animationType="slide"
                  transparent={true}
                >
                  <View style={styles.statusModalOverlay}>
                    <View style={styles.statusModalContent}>
                      <View style={styles.statusModalHeader}>
                        <Text variant="headlineSmall">Select Status</Text>
                        <Button onPress={() => setStatusModal(false)}>
                          Close
                        </Button>
                      </View>

                      <FlatList
                        data={options}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                          <TouchableOpacity
                            style={{
                              padding: 16,
                              backgroundColor:
                                formik.values.status === item.value
                                  ? "#e3f2fd"
                                  : "white",
                              borderBottomWidth: 1,
                              borderBottomColor: "#f0f0f0",
                            }}
                            onPress={() => {
                              formik.setFieldValue("status", item.value);
                              setStatusModal(false);
                            }}
                          >
                            <Text>{item.label}</Text>
                          </TouchableOpacity>
                        )}
                      />
                    </View>
                  </View>
                </Modal>
              </View>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <Button
                icon="file-plus"
                onPress={() => formik.handleSubmit()}
                mode="contained"
                style={styles.primaryButton}
                disabled={
                  mutation.isPending || !formik.dirty || !formik.isValid
                }
              >
                {mutation.isPending ? "Creating" : "Create"}
              </Button>
              <Button icon="cancel" onPress={onClose}>
                Cancel
              </Button>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default CreateListDialog;
