import { GetListsService } from "@/services/list.service";
import { useQuery } from "@tanstack/react-query";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import SingleList from "./single.list";
import { useAppTheme } from "@/hooks/theme";
import { useMemo } from "react";

const ShowLists = ({
  boardId,
  bgColor,
}: {
  boardId: string;
  bgColor: string;
}) => {
  // Initialize all required variables and constants
  const theme = useAppTheme();

  // Get the Lists for Board
  const query = useQuery({
    queryKey: ["lists", boardId],
    queryFn: () => GetListsService(boardId),
    enabled: !!boardId,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
    gcTime: 5 * 60 * 1000,
    staleTime: 30_000,
  });

  // Query refetch or refresh handler
  const handleRefresh = () => {
    query.refetch();
  };

  // Styles object
  const styles = useMemo(
    () =>
      StyleSheet.create({
        loadingView: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        },
        loadingText: {
          marginTop: 16,
        },
        errorView: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        },
        errorMessage: {
          color: "red",
          ...theme.fonts.bodyMedium,
        },
        refreshText: {
          color: theme.colors.primary,
          marginTop: 16,
        },
      }),
    [theme],
  );

  if (query.isLoading) {
    return (
      <View style={styles.loadingView}>
        <ActivityIndicator />
        <Text style={styles.loadingText}>Loading lists...</Text>
      </View>
    );
  }

  if (query.isError) {
    return (
      <View style={styles.errorView}>
        <Text style={styles.errorMessage}>Error: {query.error.message}</Text>
        <Text style={styles.refreshText} onPress={handleRefresh}>
          Tap to retry
        </Text>
      </View>
    );
  }

  const SpacingSeparator = () => {
    return <View style={{ width: 16 }}></View>;
  };

  const lists = query.data;
  return (
    <FlatList
      data={lists}
      renderItem={({ item }) => (
        <SingleList
          id={item.id}
          title={item.title}
          position={item.position}
          status={item.status}
          bgColor={bgColor}
        />
      )}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={<Text>You have not created any lists.</Text>}
      horizontal
      initialNumToRender={2}
      refreshControl={
        <RefreshControl
          refreshing={query.isRefetching}
          onRefresh={handleRefresh}
          colors={[theme.colors.accent]}
          tintColor={theme.colors.accent}
        />
      }
      ItemSeparatorComponent={() => <SpacingSeparator />}
    />
  );
};

export default ShowLists;
