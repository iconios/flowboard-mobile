import { Text, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "@/hooks/theme";
import { useLocalSearchParams } from "expo-router";
import ShowLists from "@/components/lists/show.lists";
import { Button } from "react-native-paper";
import { useState } from "react";
import CreateListDialog from "@/components/lists/create.list.dialog";
import { NotificationBarType } from "@/types/sign-up.types";
import NotificationBar from "@/components/notificationBar";

export default function ListsScreen() {
  const theme = useAppTheme();
  const { boardId, title, bgColor } = useLocalSearchParams();
  const [openDialog, setOpenDialog] = useState(false);
  const [notification, setNotification] = useState<NotificationBarType | null>(
    null,
  );

  const handleCreateListSuccess = (message: string) => {
    setNotification({
      message: `${message}`,
      messageType: "success",
    });
  };

  // Styles object
  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: -30,
    },
    view: {
      // flex: 1,
      // justifyContent: "center",
      // alignItems: "center",
    },
    titleText: {
      ...theme.fonts.headlineMedium,
      textAlign: "center",
      marginBottom: 10,
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
  });

  return (
    <SafeAreaView style={styles.container}>
      {notification && (
        <NotificationBar
          message={notification.message}
          messageType={notification.messageType}
        />
      )}
      <View style={styles.view}>
        <Text style={styles.titleText}>{title}</Text>
        <Button
          icon="shape-square-plus"
          mode="elevated"
          style={styles.button}
          labelStyle={styles.buttonText}
          onPress={() => setOpenDialog(true)}
        >
          Add New List
        </Button>
        <ShowLists boardId={boardId as string} bgColor={bgColor as string} />
      </View>
      {openDialog && (
        <CreateListDialog
          dialogOpen={openDialog}
          onClose={() => setOpenDialog(false)}
          boardId={boardId as string}
          onSuccess={handleCreateListSuccess}
        />
      )}
    </SafeAreaView>
  );
}
