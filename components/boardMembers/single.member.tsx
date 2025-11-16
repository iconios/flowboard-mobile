import { UpdateBoardMemberRoleService } from "@/services/board.members.service";
import {
  BoardMemberType,
  UpdateBoardMemberInputType,
  UpdateBoardMemberSchema,
  UpdateBoardMemberType,
} from "@/types/members.types";
import { NotificationBarType } from "@/types/sign-up.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FormikHelpers, useFormik } from "formik";
import { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Avatar, Button, TextInput } from "react-native-paper";
import { toFormikValidationSchema } from "zod-formik-adapter";
import NotificationBar from "../notificationBar";
import { useAppTheme } from "@/hooks/theme";
import { GetUserDataService } from "@/services/auth.service";

const SingleMember = ({ member }: { member: BoardMemberType }) => {
  const [roleModal, setRoleModal] = useState(false);
  const queryClient = useQueryClient();
  const [notification, setNotification] = useState<NotificationBarType | null>(
    null,
  );
  const [userId, setUserId] = useState("");
  const theme = useAppTheme();
  const name = member.user.firstname;
  const firstAlphabet = name[0];

  useEffect(() => {
    const getUserId = async () => {
      const userData = await GetUserDataService();
      if (!userData?.id) return;
      setUserId(userData.id);
    };
    getUserId();
  }, []);
  console.log("Logged-in user", userId);
  const boardOwnerUserId = member.boardOwnerUserId;
  console.log("Board owner id", boardOwnerUserId);
  const initialValues = {
    role: member.role,
  };

  const options = [
    { id: "1", label: "Admin", value: "admin" },
    { id: "2", label: "Member", value: "member" },
  ];

  enum roleEnum {
    ADMIN = "admin",
    MEMBER = "member",
  }

  const mutation = useMutation({
    mutationKey: ["update-role", member.memberId],
    mutationFn: async (values: UpdateBoardMemberInputType) =>
      await UpdateBoardMemberRoleService(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members", member.boardId] });
      setNotification({
        message: "Update successful",
        messageType: "success",
      });
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update member role";
      setNotification({
        message: errorMessage,
        messageType: "error",
      });
    },
  });

  const handleRoleChange = async (
    values: UpdateBoardMemberType,
    { setSubmitting }: FormikHelpers<UpdateBoardMemberType>,
  ) => {
    try {
      const submitData = {
        role: values.role as roleEnum,
        board_id: member.boardId,
        memberId: member.memberId,
      };
      console.log(submitData);
      if (values.role === member.role) return;
      await mutation.mutateAsync(submitData);
    } catch (error) {
      console.error("Error updating member role", error);
      setNotification({
        message: `${error}`,
        messageType: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema: toFormikValidationSchema(UpdateBoardMemberSchema),
    onSubmit: handleRoleChange,
  });

  //console.log("Called")
  // Styles object
  const styles = useMemo(
    () =>
      StyleSheet.create({
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
        viewHeader: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          marginBottom: 4,
        },
        nameText: {
          ...theme.fonts.bodyLarge,
          paddingVertical: 7,
          paddingLeft: 10,
        },
        container: {
          marginBottom: 8,
          marginTop: 4,
        },
        roleView: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        },
      }),
    [theme],
  );

  return (
    <View style={styles.container}>
      {notification && (
        <NotificationBar
          message={notification.message}
          messageType={notification.messageType}
        />
      )}
      <View style={styles.viewHeader}>
        <Avatar.Text label={firstAlphabet} size={48} />
        <Text style={styles.nameText}>{name}</Text>
      </View>
      <View style={styles.roleView}>
        {/* Role field */}
        <View style={{ flexGrow: 1 }}>
          <TextInput
            label="Select Role"
            value={formik.values.role}
            showSoftInputOnFocus={false}
            caretHidden={true}
            onPress={() => setRoleModal(true)}
            disabled={userId !== boardOwnerUserId}
            right={
              <TextInput.Icon
                icon="chevron-down"
                onPress={() => setRoleModal(true)}
                disabled={userId !== boardOwnerUserId}
              />
            }
          />

          {/* Role Selection Modal */}
          <Modal visible={roleModal} animationType="slide" transparent={true}>
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
                        formik.handleSubmit();
                        setRoleModal(false);
                      }}
                      disabled={userId !== boardOwnerUserId}
                    >
                      <Text>{item.label}</Text>
                    </Pressable>
                  )}
                />
              </View>
            </View>
          </Modal>
        </View>
        <Button icon="account-minus" labelStyle={{ paddingVertical: 9 }}>
          Remove
        </Button>
      </View>
    </View>
  );
};

export default SingleMember;
