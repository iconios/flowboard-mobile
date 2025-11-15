import { GetCommentType } from "@/types/comments.types";
import { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useAppTheme } from "@/hooks/theme";
import { IconButton } from "react-native-paper";
import DeleteCommentDialog from "./delete.comment.dialog";
import UpdateCommentModal from "./update.comment.modal";

const SingleComment = ({
  id,
  content,
  createdAt,
  updatedAt,
  taskId,
}: GetCommentType & { taskId: string }) => {
  const theme = useAppTheme();
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const created = createdAt.split("T", 1);
  const updated = updatedAt.split("T", 1);
  // Styles object
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          borderRadius: 8,
          borderColor: theme.colors.text,
          borderWidth: 1,
          padding: 4,
          marginBottom: 8,
        },
        metaDataView: {
          paddingTop: 4,
          alignItems: "flex-end",
        },
        contentText: {
          ...theme.fonts.bodySmall,
        },
        metaData: {
          ...theme.fonts.bodySmall,
          fontSize: 12,
        },
        actionsAndMeta: {
          justifyContent: "space-between",
          flexDirection: "row",
        },
        actions: {
          justifyContent: "flex-start",
          flexDirection: "row",
        },
      }),
    [theme],
  );
  return (
    <View style={styles.container}>
      <Text style={styles.contentText}>{content}</Text>
      <View style={styles.actionsAndMeta}>
        <View style={styles.actions}>
          <IconButton
            icon="pencil"
            iconColor={theme.colors.text}
            onPress={() => setUpdateModal(true)}
          />
          <IconButton
            icon="delete"
            onPress={() => setDeleteDialog(true)}
            iconColor={theme.colors.text}
          />
        </View>
        <View style={styles.metaDataView}>
          <Text style={styles.metaData}>Updated: {updated}</Text>
          <Text style={styles.metaData}>Created: {created}</Text>
        </View>
      </View>
      {deleteDialog && (
        <DeleteCommentDialog
          commentId={id}
          taskId={taskId}
          dialogOpen={deleteDialog}
          onClose={() => setDeleteDialog(false)}
        />
      )}
      {updateModal && (
        <UpdateCommentModal
          commentId={id}
          content={content}
          modalOpen={updateModal}
          taskId={taskId}
          onClose={() => setUpdateModal(false)}
        />
      )}
    </View>
  );
};

export default SingleComment;
