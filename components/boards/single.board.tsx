// Component for each board

import { StyleSheet, View } from "react-native";
import { Button, Card, Text } from "react-native-paper";
import { useAppTheme } from "@/hooks/theme";
import { useState } from "react";
import EditBoardModal from "./edit.board.modal";
import DeleteBoardDialog from "./delete.board.dialog";
import { Link } from "expo-router";

const SingleBoard = ({
  id,
  title,
  bgColor,
  boardOwner,
  ownerId,
  userId,
}: {
  id: string;
  title: string;
  bgColor: string;
  boardOwner: string;
  ownerId: string;
  userId: string;
}) => {
  const theme = useAppTheme();
  const [openModal, setOpenModal] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const styles = StyleSheet.create({
    container: {
      minHeight: 90,
      display: "flex",
      justifyContent: "space-between",
      flexDirection: "row",
      marginBottom: 14,
      borderRadius: 0,
      backgroundColor: theme.colors.background,
    },
    boardColor: {
      backgroundColor: bgColor,
      height: 30,
    },
    cardContent: {
      minWidth: "100%",
    },
    titleText: {
      ...theme.fonts.headlineSmall,
    },
    subtitleText: {
      ...theme.fonts.bodySmall,
    },
    button: {
      borderRadius: 1,
      backgroundColor: theme.colors.background,
      borderWidth: 1,
    },
    cardActions: {
      display: "flex",
      justifyContent: "space-between",
    },
  });
  return (
    <View>
      <Link
        href={{
          pathname: "/tabs/boards/[boardId]",
          params: { boardId: id, title, bgColor },
        }}
      >
        <View>
          <View style={styles.boardColor} />
          <Card style={styles.container}>
            <Card.Content style={styles.cardContent}>
              <Text style={styles.titleText}>{title}</Text>
              <Text style={styles.subtitleText}>
                Board Owner - {boardOwner}
              </Text>
            </Card.Content>
            <Card.Actions style={styles.cardActions}>
              <Button
                mode="elevated"
                icon="file-edit-outline"
                style={styles.button}
                labelStyle={{ color: ownerId === userId ? bgColor : "grey" }}
                onPress={() => setOpenModal(true)}
                disabled={ownerId !== userId}
              >
                Edit
              </Button>
              <Button
                mode="elevated"
                icon="delete"
                style={styles.button}
                labelStyle={{ color: ownerId === userId ? bgColor : "grey" }}
                onPress={() => setOpenDialog(true)}
                disabled={ownerId !== userId}
              >
                Delete
              </Button>
            </Card.Actions>
          </Card>
          {openModal && (
            <EditBoardModal
              id={id}
              title={title}
              bg_color={bgColor}
              modalOpen={openModal}
              onClose={() => setOpenModal(false)}
            />
          )}
          {openDialog && (
            <DeleteBoardDialog
              id={id}
              dialogOpen={openDialog}
              onClose={() => setOpenDialog(false)}
            />
          )}
        </View>
      </Link>
    </View>
  );
};

export default SingleBoard;
