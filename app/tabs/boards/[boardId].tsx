import { Text, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "@/hooks/theme";
import { useLocalSearchParams, useRouter } from "expo-router";
import ShowLists from "@/components/lists/show.lists";
import { Button } from "react-native-paper";
import { useState } from "react";
import CreateListDialog from "@/components/lists/create.list.dialog";
import { NotificationBarType } from "@/types/sign-up.types";
import NotificationBar from "@/components/notificationBar";

export default function ListsScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const { boardId, title, bgColor, ownerId } = useLocalSearchParams();
  const [openDialog, setOpenDialog] = useState(false);
  const [notification, setNotification] = useState<NotificationBarType | null>(
    null,
  );
  const stringBoardId = boardId as string;
  const stringTitle = title as string;
  const stringOwnerId = ownerId as string;

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
    actions: {
      display: "flex",
      justifyContent: "space-between",
      flexDirection: "row",
      gap: 4,
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
      <View>
        <Text style={styles.titleText}>{title}</Text>
        <View style={styles.actions}>
          <Button
            icon="shape-square-plus"
            mode="elevated"
            style={styles.button}
            labelStyle={styles.buttonText}
            onPress={() => setOpenDialog(true)}
          >
            Add New List
          </Button>
          <Button
            mode="elevated"
            icon="account-plus"
            style={styles.button}
            labelStyle={styles.buttonText}
            onPress={() =>
              router.push({
                pathname: "/tabs/boards/member/[boardId]",
                params: {
                  boardId: stringBoardId,
                  title: stringTitle,
                  ownerId: stringOwnerId,
                },
              })
            }
          >
            Members
          </Button>
        </View>
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
