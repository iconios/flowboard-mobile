import { View, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "@/hooks/theme";
import ShowBoards from "@/components/boards/show.boards";
import { Button } from "react-native-paper";
import { useState } from "react";
import CreateBoardModal from "@/components/boards/create.board.modal";

export default function BoardScreen() {
  const theme = useAppTheme();
  const [openModal, setOpenModal] = useState(false);

  const handleModalClose = () => {
    setOpenModal(false);
  };

  // Styles object
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 10,
    },
    content: {
      flex: 1,
    },
    button: {
      borderRadius: 1,
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      marginBottom: 4,
    },
    buttonText: {
      ...theme.fonts.headlineSmall,
    },
    subTitle: {
      ...theme.fonts.bodyMedium,
      paddingVertical: 10,
      textAlign: "center",
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <View style={styles.content}>
        <Button
          icon="shape-square-plus"
          mode="elevated"
          style={styles.button}
          onPress={() => setOpenModal(true)}
          labelStyle={styles.buttonText}
        >
          Create New Board
        </Button>
        <ShowBoards />
        {openModal && (
          <CreateBoardModal modalOpen={openModal} onClose={handleModalClose} />
        )}
      </View>
    </SafeAreaView>
  );
}
