// Component for each board

import { StyleSheet, View } from "react-native";
import { Button, Card, Text } from "react-native-paper";
import { useAppTheme } from "@/hooks/theme";
import { useState } from "react";
import EditBoardModal from "./edit.board.modal";

const SingleBoard = ({
  id,
  title,
  bgColor,
  boardOwner,
}: {
  id: string;
  title: string;
  bgColor: string;
  boardOwner: string;
}) => {
  const theme = useAppTheme();
  const [openModal, setOpenModal] = useState(false);

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
      <View style={styles.boardColor} />
      <Card style={styles.container}>
        <Card.Content style={styles.cardContent}>
          <Text style={styles.titleText}>{title}</Text>
          <Text style={styles.subtitleText}>Board Owner - {boardOwner}</Text>
        </Card.Content>
        <Card.Actions style={styles.cardActions}>
          <Button
            mode="elevated"
            icon="file-edit-outline"
            style={styles.button}
            onPress={() => setOpenModal(true)}
          >
            Edit
          </Button>
          <Button
            mode="elevated"
            icon="delete-forever-outline"
            style={styles.button}
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
    </View>
  );
};

export default SingleBoard;
