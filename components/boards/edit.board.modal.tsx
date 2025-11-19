// Component to edit board data
/*
#Plan
1. Get the initial value and feed them to the form
2. Get the updated data
3. Send the updated data to the server
4. Update the data in the UI
*/

import {
  HexColorType,
  UpdateBoardInputSchema,
  UpdateBoardInputType,
} from "@/types/boards.types";
import { FormikHelpers, useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "@/hooks/theme";
import Slider, { SliderProps } from "@react-native-community/slider";
import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  View,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";
import { fromHsv, toHsv } from "react-native-color-picker";
import { HoloColorPicker } from "react-native-color-picker/dist/HoloColorPicker";
import { HelperText, TextInput, Button } from "react-native-paper";
import NotificationBar from "../notificationBar";
import { HsvColor } from "react-native-color-picker/dist/typeHelpers";
import { NotificationBarType } from "@/types/sign-up.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateBoardService } from "@/services/boards.service";

const SliderCompat = React.forwardRef<any, SliderProps>(
  function SliderCompat(props, ref) {
    return <Slider ref={ref as any} {...props} />;
  },
);
SliderCompat.displayName = "SliderCompat";

const EditBoardModal = ({
  id,
  title,
  bg_color,
  modalOpen,
  onClose,
}: UpdateBoardInputType & { modalOpen: boolean; onClose: () => void }) => {
  // 1. Get the initial value and feed them to the form
  const theme = useAppTheme();
  const queryClient = useQueryClient();
  const [hsv, setHsv] = useState<HsvColor>(toHsv(bg_color));
  const [notification, setNotification] = useState<NotificationBarType | null>(
    null,
  );
  const initialValues = {
    id,
    title,
    bg_color,
  };

  const mutation = useMutation({
    mutationKey: ["edit-boards"],
    mutationFn: async (values: UpdateBoardInputType) =>
      await UpdateBoardService(values),
    onSuccess: () => {
      setNotification({
        message: "Board updated successfully",
        messageType: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["boards"] });
      formik.resetForm();
      onClose();
    },
    onError: (error) => {
      setNotification({
        message: error.message || "Failed to update board",
        messageType: "error",
      });
    },
  });

  const handleFormSubmit = async (
    values: UpdateBoardInputType,
    { setSubmitting }: FormikHelpers<UpdateBoardInputType>,
  ) => {
    try {
      await mutation.mutateAsync(values);
    } catch (error) {
      console.error("Error updating board", error);
    } finally {
      setSubmitting(false);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema: toFormikValidationSchema(UpdateBoardInputSchema),
    onSubmit: handleFormSubmit,
  });

  // Hsv helper functions
  const setH = (h: number) => setHsv((c) => ({ ...c, h }));
  const setS = (s: number) => setHsv((c) => ({ ...c, s }));
  const setV = (v: number) => setHsv((c) => ({ ...c, v }));

  // Keep HSV in sync when color picker value changes
  useEffect(() => {
    setHsv(toHsv(formik.values.bg_color));
  }, [formik.values.bg_color]);

  const handleColorSelected = () => {
    const hexColor: HexColorType = fromHsv(hsv);
    formik.setFieldValue("bg_color", hexColor);
  };
  const styles = useMemo(
    () =>
      StyleSheet.create({
        textInput: {
          backgroundColor: theme.colors.background,
          color: theme.colors.text,
          marginBottom: 10,
          ...theme.fonts.bodyMedium,
        },
        preview: {
          backgroundColor: fromHsv(hsv),
          height: 30,
          borderRadius: 6,
          marginBottom: 8,
        },
        slider: {
          marginTop: 12,
        },
        picker: {
          height: 180,
          marginTop: 8,
        },
        actions: {
          flexDirection: "row",
          gap: 12,
          marginTop: 16,
          justifyContent: "space-between",
        },
        titleText: {
          ...theme.fonts.headlineSmall,
          marginBottom: 24,
          textAlign: "center",
          marginTop: 70,
        },
        formContainer: {
          flex: 1,
          backgroundColor: theme.colors.background,
          padding: 16,
          justifyContent: "center",
        },
        container: {},
        primaryButton: {
          paddingHorizontal: 4,
          borderRadius: 1,
        },
      }),
    [theme, hsv],
  );

  return (
    <SafeAreaView style={styles.container}>
      {notification && (
        <NotificationBar
          message={notification.message}
          messageType={notification.messageType}
        />
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalOpen}
        onRequestClose={() => onClose()}
      >
        <View style={styles.formContainer}>
          <Text style={styles.titleText}>Edit Board</Text>
          <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
            <ScrollView>
              <TextInput
                id="title"
                label="Title"
                value={formik.values.title}
                onChangeText={formik.handleChange("title")}
                onBlur={formik.handleBlur("title")}
                error={formik.touched.title && Boolean(formik.errors.title)}
                autoCapitalize="words"
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

              <View style={styles.preview} />
              <Text style={[{ marginTop: 6 }, styles.textInput]}>
                Use sliders to set Background Color
              </Text>
              <HoloColorPicker
                color={hsv}
                onColorChange={setHsv}
                style={styles.picker}
                onColorSelected={() => handleColorSelected()}
                sliderComponent={SliderCompat as any}
                hideSliders
              />

              {/* Hue (0-360) */}
              <Slider
                value={hsv.h}
                minimumValue={0}
                maximumValue={360}
                onValueChange={setH}
                step={1}
                style={styles.slider}
                onSlidingComplete={handleColorSelected}
              />

              {/* Saturation (0-1) */}
              <Slider
                value={hsv.s}
                minimumValue={0}
                maximumValue={1}
                onValueChange={setS}
                step={0.01}
                style={styles.slider}
                onSlidingComplete={handleColorSelected}
              />

              {/* Value/Brightness (0-1) */}
              <Slider
                value={hsv.v}
                minimumValue={0}
                maximumValue={1}
                onValueChange={setV}
                step={0.01}
                style={styles.slider}
                onSlidingComplete={handleColorSelected}
              />

              <View style={styles.actions}>
                <Button
                  disabled={mutation.isPending}
                  onPress={formik.submitForm}
                  icon="file-edit"
                  mode="contained"
                  style={styles.primaryButton}
                >
                  {mutation.isPending ? "Editing" : "Edit"}
                </Button>
                <Button
                  onPress={() => {
                    onClose();
                    formik.resetForm();
                  }}
                  icon="cancel"
                  labelStyle={{ color: theme.colors.accent }}
                >
                  Cancel
                </Button>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default EditBoardModal;
