// Component to show a Task

import { UpdateTaskService } from "@/services/tasks.service";
import { NotificationBarType } from "@/types/sign-up.types";
import {
  ShowSingleTaskType,
  UpdateTaskFormInputSchema,
  UpdateTaskFormInputType,
  UpdateTaskInputType,
  UpdateTaskUIType,
} from "@/types/tasks.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FormikHelpers, useFormik } from "formik";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
  StyleSheet,
  useColorScheme,
  Keyboard,
} from "react-native";
import { HelperText, TextInput, Button } from "react-native-paper";
import { toFormikValidationSchema } from "zod-formik-adapter";
import NotificationBar from "../notificationBar";
import { useAppTheme } from "@/hooks/theme";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import ShowComments from "../comments/show.comments";
import CreateCommentModal from "../comments/create.comment.modal";

const ShowSingleTask = ({
  id,
  title,
  description,
  dueDate,
  priority,
  position,
  listId,
}: ShowSingleTaskType) => {
  const queryClient = useQueryClient();
  const theme = useAppTheme();
  const [showPicker, setShowPicker] = useState(false);
  const [priorityModal, setPriorityModal] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [notification, setNotification] = useState<NotificationBarType | null>(
    null,
  );
  const [savingField, setSavingField] = useState<string | null>(null);

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

  const handleCreateSuccess = (message: string) => {
    setNotification({
      message,
      messageType: "success",
    });
  };

  const handleCreateError = (errorMessage: string) => {
    setNotification({
      message: errorMessage,
      messageType: "error",
    });
  };

  const initialValues = {
    title,
    position: `${position}`,
    priority,
    description,
    dueDate: dueDate
      ? new Date(dueDate).toISOString()
      : new Date().toISOString(),
    taskId: id,
  };

  const mutation = useMutation({
    mutationKey: ["update-task", listId, id],
    mutationFn: async (values: UpdateTaskInputType) =>
      await UpdateTaskService(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", listId] });
      formik.resetForm();
      setNotification({
        message: "Task updated successfully",
        messageType: "success",
      });
    },
    onError: (error) => {
      setNotification({
        message: error.message || "Failed to create task",
        messageType: "error",
      });
    },
  });

  const handleFormSubmit = async (
    values: UpdateTaskFormInputType,
    { setSubmitting }: FormikHelpers<UpdateTaskFormInputType>,
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
    validationSchema: toFormikValidationSchema(UpdateTaskFormInputSchema),
    onSubmit: handleFormSubmit,
  });

  // Check if a specific field is dirty
  const isFieldDirty = (fieldName: keyof UpdateTaskUIType) => {
    return formik.initialValues[fieldName] !== formik.values[fieldName];
  };

  // Reset a specific field to its initial value
  const resetField = (fieldName: keyof UpdateTaskUIType) => {
    formik.setFieldValue(fieldName, formik.initialValues[fieldName]);
    formik.setFieldTouched(fieldName, false);
  };

  const saveField = (fieldName: keyof UpdateTaskUIType) => {
    Keyboard.dismiss();
    requestAnimationFrame(async () => {
      await saveAction(fieldName);
    });
  };
  const saveAction = async (
    fieldName: keyof UpdateTaskUIType,
  ): Promise<void> => {
    setSavingField(fieldName);
    try {
      // Validate the field first
      await formik.validateField(fieldName);

      if (formik.errors[fieldName]) return;

      console.log(`Saving ${fieldName}:`, formik.values[fieldName]);

      // Handle position field type conversion
      let valueToSend: string | number = formik.values[fieldName];
      if (fieldName === "position") {
        valueToSend = Number.parseInt(formik.values.position as string, 10);
        console.log(
          `Position converted from string to number: ${formik.values.position} -> ${valueToSend}`,
        );
      }
      // Create payload with only the changed field
      const payLoad = {
        taskId: id,
        [fieldName]: valueToSend,
      } as UpdateTaskInputType;

      setNotification(null);
      try {
        await mutation.mutateAsync(payLoad);
        // After successful save, update initialValues to reflect the new state

        formik.resetForm({
          values: formik.values,
        });
      } catch (error) {
        console.error("Error updating task", error);
      }
    } finally {
      setSavingField(null);
    }
  };

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
          ...theme.fonts.headlineMedium,
          textAlign: "left",
          marginBottom: 16,
          paddingLeft: 0,
        },
        descriptionLabel: {
          fontSize: 18,
          fontWeight: "600",
          marginBottom: -2,
          marginTop: 8,
        },
        descriptionText: {
          ...theme.fonts.bodyMedium,
          marginBottom: 16,
          marginTop: 0,
          backgroundColor: theme.colors.secondary,
        },
        textInputContent: {
          color: theme.colors.secondaryText,
          tintColor: theme.colors.secondaryText,
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
        dirtyButton: {
          marginTop: 4,
          marginBottom: 12,
          gap: 8,
          justifyContent: "flex-end",
          flexDirection: "row",
        },
      }),
    [theme, isDark],
  );

  return (
    <View>
      {notification && (
        <NotificationBar
          message={notification.message}
          messageType={notification.messageType}
        />
      )}
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === "ios" ? 150 : 120}
      >
        <ScrollView keyboardShouldPersistTaps="handled">
          {/* Form Content */}
          <View>
            <TextInput
              id="title"
              value={formik.values.title}
              onChangeText={formik.handleChange("title")}
              multiline
              onBlur={formik.handleBlur("title")}
              error={formik.touched.title && Boolean(formik.errors.title)}
              autoCapitalize="words"
              contentStyle={[
                styles.titleText,
                styles.textInputContent,
                { paddingBottom: 0 },
              ]}
              outlineStyle={{ borderWidth: 1 }}
              style={styles.descriptionText}
              mode="outlined"
              right={<TextInput.Icon icon="pencil" size={18} color={theme.colors.text} />}
            />
            {formik.touched.title && !!formik.errors.title && (
              <HelperText
                type="error"
                visible={formik.touched.title && !!formik.errors.title}
              >
                {formik.errors.title}
              </HelperText>
            )}
            {isFieldDirty("title") && (
              <View style={styles.dirtyButton}>
                <Button icon="close" onPress={() => resetField("title")}>
                  Cancel
                </Button>
                <Button
                  icon="check"
                  onPress={() => saveField("title")}
                  disabled={
                    Boolean(formik.errors.title) || savingField === "title"
                  }
                  loading={savingField === "title"}
                >
                  {savingField === "title" ? "Saving..." : "Save"}
                </Button>
              </View>
            )}

            <Text style={[styles.descriptionLabel, styles.textInputContent]}>
              Description
            </Text>
            <TextInput
              id="description"
              value={formik.values.description}
              onChangeText={formik.handleChange("description")}
              onBlur={formik.handleBlur("description")}
              placeholder="Add a description"
              multiline
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              autoCapitalize="none"
              style={styles.descriptionText}
              mode="outlined"
              contentStyle={[
                { paddingTop: 2, paddingLeft: 0 },
                styles.textInputContent,
              ]}
              outlineStyle={{ borderWidth: 0 }}
              right={<TextInput.Icon icon="pencil" size={18} color={theme.colors.text} />}
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
            {isFieldDirty("description") && (
              <View style={styles.dirtyButton}>
                <Button icon="close" onPress={() => resetField("description")}>
                  Cancel
                </Button>
                <Button
                  icon="check"
                  onPress={() => saveField("description")}
                  disabled={
                    Boolean(formik.errors.description) ||
                    savingField === "description"
                  }
                  loading={savingField === "description"}
                >
                  {savingField === "description" ? "Saving..." : "Save"}
                </Button>
              </View>
            )}

            <TextInput
              id="position"
              label="Position"
              value={formik.values.position}
              onChangeText={formik.handleChange("position")}
              onBlur={formik.handleBlur("position")}
              error={formik.touched.position && Boolean(formik.errors.position)}
              style={styles.descriptionText}
              contentStyle={styles.textInputContent}
              keyboardType="numeric"
              mode="outlined"
              right={<TextInput.Icon icon="pencil" size={18} color={theme.colors.text} />}
            />
            {formik.touched.position && !!formik.errors.position && (
              <HelperText
                type="error"
                visible={formik.touched.position && !!formik.errors.position}
              >
                {formik.errors.position}
              </HelperText>
            )}
            {isFieldDirty("position") && (
              <View style={styles.dirtyButton}>
                <Button icon="close" onPress={() => resetField("position")}>
                  Cancel
                </Button>
                <Button
                  icon="check"
                  onPress={() => saveField("position")}
                  disabled={
                    Boolean(formik.errors.position) ||
                    savingField === "position"
                  }
                  loading={savingField === "position"}
                >
                  {savingField === "position" ? "Saving..." : "Save"}
                </Button>
              </View>
            )}

            {/* Date-time Picker */}
            <View>
              <Text style={[styles.descriptionLabel, styles.textInputContent]}>
                Due Date
              </Text>
              <Pressable onPress={openDatePicker}>
                <View pointerEvents="none">
                  <TextInput
                    id="dueDate"
                    value={formatDisplayDate(formik.values.dueDate)}
                    editable={false}
                    error={
                      formik.touched.dueDate && Boolean(formik.errors.dueDate)
                    }
                    style={[styles.descriptionText, { fontSize: 16 }]}
                    mode="outlined"
                    outlineStyle={{ borderWidth: 0 }}
                    contentStyle={[
                      {
                        paddingTop: 0,
                        paddingLeft: 0,
                        marginTop: -18,
                      },
                      styles.textInputContent,
                    ]}
                    right={
                      <TextInput.Icon
                        icon="calendar"
                        onPress={openDatePicker}
                      />
                    }
                  />
                </View>
              </Pressable>
              {isFieldDirty("dueDate") && (
                <View style={styles.dirtyButton}>
                  <Button icon="close" onPress={() => resetField("dueDate")}>
                    Cancel
                  </Button>
                  <Button
                    icon="check"
                    onPress={() => saveField("dueDate")}
                    disabled={
                      Boolean(formik.errors.dueDate) ||
                      savingField === "dueDate"
                    }
                    loading={savingField === "dueDate"}
                  >
                    {savingField === "dueDate" ? "Saving..." : "Save"}
                  </Button>
                </View>
              )}
            </View>
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
                            { ...theme.fonts.headlineSmall },
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
              <Text
                style={[
                  styles.descriptionLabel,
                  { marginBottom: 0 },
                  styles.textInputContent,
                ]}
              >
                Priority
              </Text>
              <TextInput
                value={formik.values.priority}
                showSoftInputOnFocus={false}
                style={styles.descriptionText}
                caretHidden={true}
                contentStyle={[styles.textInputContent, { paddingLeft: 0 }]}
                onPress={() => setPriorityModal(true)}
                right={
                  <TextInput.Icon
                    icon="chevron-down"
                    onPress={() => setPriorityModal(true)}
                  />
                }
              />
              {isFieldDirty("priority") && (
                <View style={styles.dirtyButton}>
                  <Button icon="close" onPress={() => resetField("priority")}>
                    Cancel
                  </Button>
                  <Button
                    icon="check"
                    onPress={() => saveField("priority")}
                    disabled={
                      Boolean(formik.errors.priority) ||
                      savingField === "priority"
                    }
                    loading={savingField === "priority"}
                  >
                    {savingField === "priority" ? "Saving..." : "Save"}
                  </Button>
                </View>
              )}

              {/* Priority Selection Modal */}
              <Modal
                visible={priorityModal}
                animationType="slide"
                transparent={true}
              >
                <View style={styles.priorityModalOverlay}>
                  <View style={styles.priorityModalContent}>
                    <View style={styles.priorityModalHeader}>
                      <Text style={{ ...theme.fonts.headlineSmall }}>
                        Select priority
                      </Text>
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
                          <Text style={{ fontSize: 18 }}>{item.label}</Text>
                        </Pressable>
                      )}
                    />
                  </View>
                </View>
              </Modal>
            </View>
          </View>

          {/* Comments */}
          <View>
            <CreateCommentModal
              taskId={id}
              onSuccess={handleCreateSuccess}
              onError={handleCreateError}
            />
            <ShowComments taskId={id} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ShowSingleTask;
