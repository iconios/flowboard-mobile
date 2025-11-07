import { GetBoardsService } from "@/services/boards.service";
import { NotificationBarType } from "@/types/sign-up.types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import NotificationBar from "../notificationBar";
import { ActivityIndicator } from "react-native-paper";
import { useAppTheme } from "@/hooks/theme";
import SingleBoard from "./single.board";

const ShowBoards = () => {
  const theme = useAppTheme();
  const [notification, setNotification] = useState<NotificationBarType | null>(
    null,
  );
  const { error, isPending, isError, data } = useQuery({
    queryKey: ["boards"],
    queryFn: async () => await GetBoardsService(),
  });

  useEffect(() => {
    if (isError) {
      setNotification({
        message: error.message || "An error occurred",
        messageType: "error",
      });
    }
  }, [isError, error]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        pendingView: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        },
        container: {
          flex: 1,
        },
        list: {
          flex: 1,
        },
        emptyWrap: {
          paddingVertical: 32,
          alignItems: "center",
          flex: 1,
          justifyContent: "center",
        },
        contentContainer: {
          flexGrow: 1,
          paddingVertical: 12,
        },
      }),
    [],
  );

  if (isPending) {
    return (
      <View style={styles.pendingView}>
        <ActivityIndicator animating={true} color={theme.colors.accent} />
        <Text style={{ marginTop: 8 }}>Loading board...</Text>
      </View>
    );
  }

  const boards = data?.data ?? [];

  if (!isPending && data?.data.length === 0) {
    return (
      <View style={styles.pendingView}>
        <Text>No boards found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {notification && (
        <NotificationBar
          message={error?.message || "Error"}
          messageType="error"
        />
      )}
      <FlatList
        style={styles.list}
        data={boards}
        renderItem={({ item }) => (
          <SingleBoard
            id={item._id}
            title={item.title}
            bgColor={item.bg_color}
            boardOwner={item.user.firstname}
          />
        )}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.contentContainer}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text>No boards found</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default ShowBoards;
