import {
  FlatList,
  Keyboard,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  useColorScheme,
} from "react-native";
import { Button, HelperText, TextInput, Text } from "react-native-paper";
import { FormikHelpers, useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { useAppTheme } from "@/hooks/theme";
import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NotificationBarType } from "@/types/sign-up.types";
import NotificationBar from "../notificationBar";
import { CreateTaskService } from "@/services/tasks.service";
import {
  CreateTaskFormInputSchema,
  CreateTaskFormInputType,
} from "@/types/tasks.types";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";

const CreateTaskDialog = ({
  dialogOpen,
  onClose,
  listId,
  onSuccess,
}: {
  dialogOpen: boolean;
  onClose: () => void;
  listId: string;
  onSuccess: (v: string) => void;
}) => {
  const theme = useAppTheme();
  const queryClient = useQueryClient();
  const [priorityModal, setPriorityModal] = useState(false);
  const [notification, setNotification] = useState<NotificationBarType | null>(
    null,
  );
  const [showPicker, setShowPicker] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // Date handling functions
  const openDatePicker = () => {
    if (Platform.OS === "ios") {
      setShowPicker(true);
    } else {
      openAndroidDateTimePicker();
    }
  };
  const closeDatePicker = () => setShowPicker(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowPicker(false);
    }

    if (selectedDate) {
      formik.setFieldValue("dueDate", selectedDate.toISOString());
    }
  };

  const formatDisplayDate = (isoString: string): string => {
    if (!isoString) return "";
    try {
      const date = new Date(isoString);
      return date.toLocaleString();
    } catch (error) {
      console.error("Format display date error", error);
      return "";
    }
  };

  const getCurrentDateValue = (): Date => {
    try {
      return formik.values.dueDate
        ? new Date(formik.values.dueDate)
        : new Date();
    } catch (error) {
      console.error("Error getting current date", error);
      return new Date();
    }
  };

  // Android DateTimePicker Helper function
  const openAndroidDateTimePicker = () => {
    const current = getCurrentDateValue();

    DateTimePickerAndroid.open({
      value: current,
      mode: "date",
      onChange: (dateEvent, selectedDate) => {
        // User pressed "Cancel"
        if (dateEvent.type !== "set" || !selectedDate) return;

        // Then open Time
        DateTimePickerAndroid.open({
          value: selectedDate,
          mode: "time",
          is24Hour: true,
          onChange: (timeEvent, selectedTime) => {
            // User pressed "Cancel"
            if (timeEvent.type !== "set" || !selectedTime) return;

            const final = new Date(selectedDate);
            final.setHours(
              selectedTime.getHours(),
              selectedTime.getMinutes(),
              0,
              0,
            );
            formik.setFieldValue("dueDate", final.toISOString());
          },
        });
      },
    });
  };

  const options = [
    {
      id: "1",
      label: "Low",
      value: "low",
    },
    {
      id: "2",
      label: "Medium",
      value: "medium",
    },
    {
      id: "3",
      label: "High",
      value: "high",
    },
    {
      id: "4",
      label: "Critical",
      value: "critical",
    },
  ];
  const initialValues = {
    title: "",
    position: "0",
    priority: "low",
    description: "",
    dueDate: new Date().toISOString(),
    listId,
  };

  const mutation = useMutation({
    mutationKey: ["create-task", listId],
    mutationFn: async (values: {
      title: string;
      position: number;
      priority: string;
      listId: string;
      description: string;
      dueDate: string;
    }) => await CreateTaskService(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", listId] });
      formik.resetForm();
      onSuccess("Task created successfully");
      onClose();
    },
    onError: (error) => {
      setNotification({
        message: error.message || "Failed to create task",
        messageType: "error",
      });
    },
  });

  const handleFormSubmit = async (
    values: CreateTaskFormInputType,
    { setSubmitting }: FormikHelpers<CreateTaskFormInputType>,
  ) => {
    try {
      const submitData = {
        ...values,
        position: Number.parseInt(values.position, 10),
        title: values.title.trim(),
        listId,
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
    validationSchema: toFormikValidationSchema(CreateTaskFormInputSchema),
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
          maxHeight: "80%",
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
        // Styles for the priority modal
        priorityModalOverlay: {
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          justifyContent: "center",
          padding: 20,
        },
        priorityModalContent: {
          backgroundColor: "white",
          borderRadius: 8,
          padding: 16,
          maxHeight: "60%",
        },
        priorityModalHeader: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        },
        dateModalOverlay: {
          flex: 1,
          justifyContent: "flex-end",
          backgroundColor: "rgba(0,0,0,0.5)",
        },
        dateModalContent: {
          backgroundColor: isDark ? "#1C1C1E" : "white",
          borderTopEndRadius: 20,
          borderTopStartRadius: 20,
          padding: 20,
          maxHeight: "50%",
          minHeight: 350,
        },
        dateView: {
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 10,
        },
        datePickerContainer: {
          height: 200,
          justifyContent: "center",
        },
        dateTimePicker: {
          height: 200,
          width: "100%",
        },
        // For Android picker positioning
        androidPickerContainer: {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "white",
        },
      }),
    [theme, isDark],
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
            <ScrollView>
              {/* Title */}
              <Text style={styles.titleText}>Create a Task</Text>

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
                  id="description"
                  label="Description"
                  value={formik.values.description}
                  onChangeText={formik.handleChange("description")}
                  onBlur={formik.handleBlur("description")}
                  error={
                    formik.touched.description &&
                    Boolean(formik.errors.description)
                  }
                  autoCapitalize="none"
                  style={styles.textInput}
                  mode="outlined"
                />
                {formik.touched.description && !!formik.errors.description && (
                  <HelperText
                    type="error"
                    visible={
                      formik.touched.description && !!formik.errors.description
                    }
                  >
                    {formik.errors.description}
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
                    visible={
                      formik.touched.position && !!formik.errors.position
                    }
                  >
                    {formik.errors.position}
                  </HelperText>
                )}

                {/* Date-time Picker */}
                <Pressable onPress={openDatePicker}>
                  <View pointerEvents="none">
                    <TextInput
                      id="dueDate"
                      label="Due Date & Time"
                      value={formatDisplayDate(formik.values.dueDate)}
                      editable={false}
                      error={
                        formik.touched.dueDate && Boolean(formik.errors.dueDate)
                      }
                      style={styles.textInput}
                      mode="outlined"
                      right={
                        <TextInput.Icon
                          icon="calendar"
                          onPress={openDatePicker}
                        />
                      }
                    />
                  </View>
                </Pressable>
                {formik.touched.dueDate && !!formik.errors.dueDate && (
                  <HelperText
                    type="error"
                    visible={formik.touched.dueDate && !!formik.errors.dueDate}
                  >
                    {formik.errors.dueDate}
                  </HelperText>
                )}

                {/* DateTimePicker Modal */}
                {showPicker &&
                  (Platform.OS === "ios" ? (
                    <Modal
                      visible={showPicker}
                      transparent={true}
                      animationType="slide"
                      onRequestClose={closeDatePicker}
                      presentationStyle="overFullScreen"
                    >
                      <View style={styles.dateModalOverlay}>
                        <View style={styles.dateModalContent}>
                          <View style={styles.dateView}>
                            <Button onPress={closeDatePicker}>Cancel</Button>
                            <Text
                              style={[
                                styles.titleText,
                                { color: isDark ? "white" : "black" },
                              ]}
                            >
                              Select Date & Time
                            </Text>
                            <Button onPress={closeDatePicker}>Done</Button>
                          </View>
                          <View style={styles.datePickerContainer}>
                            <DateTimePicker
                              mode="datetime"
                              display="spinner"
                              onChange={handleDateChange}
                              value={getCurrentDateValue()}
                              style={styles.dateTimePicker}
                              themeVariant={isDark ? "dark" : "light"}
                              textColor={isDark ? "#FFFFFF" : "#000000"}
                            />
                          </View>
                        </View>
                      </View>
                    </Modal>
                  ) : (
                    <></>
                  ))}

                {/* Priority Selector */}
                <View>
                  <TextInput
                    label="Select priority"
                    value={formik.values.priority}
                    showSoftInputOnFocus={false}
                    caretHidden={true}
                    onPressIn={() => setPriorityModal(true)}
                    right={<TextInput.Icon icon="chevron-down" />}
                  />

                  {/* Priority Selection Modal */}
                  <Modal
                    visible={priorityModal}
                    animationType="slide"
                    transparent={true}
                  >
                    <View style={styles.priorityModalOverlay}>
                      <View style={styles.priorityModalContent}>
                        <View style={styles.priorityModalHeader}>
                          <Text variant="headlineSmall">Select priority</Text>
                          <Button onPress={() => setPriorityModal(false)}>
                            Close
                          </Button>
                        </View>

                        <FlatList
                          data={options}
                          keyExtractor={(item) => item.id}
                          renderItem={({ item }) => (
                            <Pressable
                              style={{
                                padding: 16,
                                backgroundColor:
                                  formik.values.priority === item.value
                                    ? "#e3f2fd"
                                    : "white",
                                borderBottomWidth: 1,
                                borderBottomColor: "#f0f0f0",
                              }}
                              onPress={() => {
                                formik.setFieldValue("priority", item.value);
                                setPriorityModal(false);
                              }}
                            >
                              <Text>{item.label}</Text>
                            </Pressable>
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
                <Button
                  icon="cancel"
                  onPress={onClose}
                  labelStyle={{ color: theme.colors.accent }}
                >
                  Cancel
                </Button>
              </View>
            </ScrollView>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default CreateTaskDialog;
