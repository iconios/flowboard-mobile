import { useAppTheme } from "@/hooks/theme";
import { UpdateCommentService } from "@/services/comment.service";
import {
  CommentFormInputSchema,
  CommentFormInputType,
  UpdateCommentFormSchema,
  UpdateCommentFormType,
  UpdateCommentInputType,
} from "@/types/comments.types";
import { NotificationBarType } from "@/types/sign-up.types";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { FormikHelpers, useFormik } from "formik";
import { useMemo, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import { HelperText, Button, TextInput } from "react-native-paper";
import { toFormikValidationSchema } from "zod-formik-adapter";
import NotificationBar from "../notificationBar";

const UpdateCommentModal = ({
  taskId,
  commentId,
  content,
  onClose,
  modalOpen,
}: UpdateCommentInputType & {
  modalOpen: boolean;
  taskId: string;
  onClose: () => void;
}) => {
  const theme = useAppTheme();
  const queryClient = useQueryClient();
  const [notification, setNotification] = useState<NotificationBarType | null>(
    null,
  );
  const initialValues = {
    content,
  };

  const mutation = useMutation({
    mutationKey: ["update-comment", commentId],
    mutationFn: async (values: UpdateCommentFormType & { commentId: string }) =>
      await UpdateCommentService(values),
    onSuccess: () => {
      setNotification({
        message: "Comment updated suceessfully",
        messageType: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["comments", taskId] });
      formik.resetForm();
      onClose();
    },
    onError: (error) => {
      setNotification({
        message: `${error.message}` || "Failed to create comment",
        messageType: "error",
      });
    },
  });

  const handleFormSubmit = async (
    values: UpdateCommentFormType,
    { setSubmitting }: FormikHelpers<UpdateCommentFormType>,
  ) => {
    try {
      console.log({
        ...values,
        commentId,
      });
      await mutation.mutateAsync({
        ...values,
        commentId,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema: toFormikValidationSchema(UpdateCommentFormSchema),
    onSubmit: handleFormSubmit,
  });

  // Styles object
  const styles = useMemo(
    () =>
      StyleSheet.create({
        textInput: {
          backgroundColor: theme.colors.background,
          color: theme.colors.text,
          ...theme.fonts.bodyMedium,
          textAlignVertical: "top",
        },
        backdrop: {
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.4)",
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 24,
        },
        card: {
          width: "100%",
          borderRadius: 8,
          backgroundColor: theme.colors.background,
          paddingHorizontal: 16,
          paddingVertical: 20,
        },
        actions: {
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 16,
          display: formik.values.content ? "flex" : "none",
        },
        titleText: {
          ...theme.fonts.headlineSmall,
          textAlign: "center",
          marginBottom: 16,
        },
        primaryButton: {
          paddingHorizontal: 4,
          borderRadius: 1,
        },
      }),
    [theme, formik.values.content],
  );

  return (
    <>
      {notification && (
        <NotificationBar
          message={notification.message}
          messageType={notification.messageType}
        />
      )}
      <Modal
        animationType="slide"
        transparent
        visible={modalOpen}
        onRequestClose={onClose}
      >
        <KeyboardAvoidingView
          keyboardVerticalOffset={0}
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.backdrop}>
              <TouchableWithoutFeedback>
                <View style={styles.card}>
                  <Text style={styles.titleText}>Update Comment</Text>

                  <ScrollView
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    style={{ maxHeight: 260 }}
                    contentContainerStyle={{ paddingBottom: 8 }}
                  >
                    <TextInput
                      id="content"
                      value={formik.values.content}
                      onChangeText={formik.handleChange("content")}
                      onBlur={formik.handleBlur("content")}
                      error={
                        formik.touched.content && Boolean(formik.errors.content)
                      }
                      autoCapitalize="sentences"
                      maxLength={100}
                      style={[
                        styles.textInput,
                        { minHeight: 120, maxHeight: 180 },
                      ]}
                      multiline
                      mode="outlined"
                    />
                    {formik.touched.content && !!formik.errors.content && (
                      <HelperText
                        type="error"
                        visible={
                          formik.touched.content && !!formik.errors.content
                        }
                      >
                        {formik.errors.content}
                      </HelperText>
                    )}
                  </ScrollView>
                  <View style={styles.actions}>
                    <Button
                      icon="file-edit"
                      onPress={() => formik.handleSubmit()}
                      disabled={mutation.isPending || formik.isSubmitting}
                      mode="contained"
                      style={styles.primaryButton}
                    >
                      {formik.isSubmitting ? "Updating" : "Update"}
                    </Button>
                    <Button
                      icon="cancel"
                      onPress={() => {
                        formik.resetForm();
                        onClose();
                      }}
                      labelStyle={{ color: theme.colors.accent }}
                    >
                      Cancel
                    </Button>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
};

export default UpdateCommentModal;
