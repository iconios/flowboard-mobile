// Component to create a comment

import {
  CommentFormInputSchema,
  CommentFormInputType,
} from "@/types/comments.types";
import { FormikHelpers, useFormik } from "formik";
import { useMemo } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Button, HelperText, TextInput } from "react-native-paper";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { useAppTheme } from "@/hooks/theme";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateCommentService } from "@/services/comment.service";

const CreateCommentModal = ({
  taskId,
  onSuccess,
  onError,
}: {
  taskId: string;
  onSuccess: (v: string) => void;
  onError: (v: string) => void;
}) => {
  const theme = useAppTheme();
  const queryClient = useQueryClient();
  const initialValues = {
    content: "",
  };

  const mutation = useMutation({
    mutationKey: ["create-comment", taskId],
    mutationFn: async (values: CommentFormInputType & { taskId: string }) =>
      await CreateCommentService(values),
    onSuccess: () => {
      onSuccess("Comment created suceessfully");
      queryClient.invalidateQueries({ queryKey: ["comments", taskId] });
      formik.resetForm();
    },
    onError: (error) =>
      onError(`${error.message}` || "Failed to create comment"),
  });

  const handleFormSubmit = async (
    values: CommentFormInputType,
    { setSubmitting }: FormikHelpers<CommentFormInputType>,
  ) => {
    try {
      console.log(values);
      await mutation.mutateAsync({
        ...values,
        taskId,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema: toFormikValidationSchema(CommentFormInputSchema),
    onSubmit: handleFormSubmit,
  });

  // Styles object
  const styles = useMemo(
    () =>
      StyleSheet.create({
        textInput: {
          backgroundColor: theme.colors.background,
          color: theme.colors.text,
          marginBottom: 0,
          ...theme.fonts.bodyMedium,
        },
        actions: {
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 16,
          display: formik.values.content ? "flex" : "none",
        },
        container: {
          display: "flex",
          marginBottom: 10,
        },
        titleText: {
          ...theme.fonts.headlineSmall,
          textAlign: "left",
          marginBottom: 16,
          paddingLeft: 0,
        },
        primaryButton: {
          paddingHorizontal: 4,
          borderRadius: 1,
        },
      }),
    [theme, formik.values.content],
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Comments</Text>
      <View>
        <TextInput
          id="content"
          placeholder="Enter a comment"
          value={formik.values.content}
          onChangeText={formik.handleChange("content")}
          onBlur={formik.handleBlur("content")}
          error={formik.touched.content && Boolean(formik.errors.content)}
          autoCapitalize="sentences"
          style={styles.textInput}
          multiline
          mode="outlined"
          contentStyle={{ textAlignVertical: "center" }}
        />
        {formik.touched.content && !!formik.errors.content && (
          <HelperText
            type="error"
            visible={formik.touched.content && !!formik.errors.content}
          >
            {formik.errors.content}
          </HelperText>
        )}
      </View>
      <View style={styles.actions}>
        <Button
          icon="plus"
          onPress={() => formik.handleSubmit()}
          disabled={mutation.isPending || formik.isSubmitting}
          mode="contained"
          style={styles.primaryButton}
        >
          {formik.isSubmitting ? "Creating" : "Create"}
        </Button>
        <Button icon="cancel" onPress={() => formik.resetForm()}>
          Cancel
        </Button>
      </View>
    </View>
  );
};

export default CreateCommentModal;
