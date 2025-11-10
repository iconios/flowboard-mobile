import { GetTasksService } from "@/services/tasks.service";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import {
  ActivityIndicator,
  View,
  StyleSheet,
  Text,
  FlatList,
  RefreshControl,
} from "react-native";
import { useAppTheme } from "@/hooks/theme";
import SingleTask from "./single.task";

const ShowTasks = ({ listId }: { listId: string }) => {
  // Initialize the variables and constants
  const theme = useAppTheme();
  const query = useQuery({
    queryKey: ["tasks", listId],
    queryFn: async ({ signal }) => await GetTasksService(listId, { signal }),
    enabled: !!listId,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
    gcTime: 5 * 60 * 1000,
    staleTime: 30_000,
  });

  // Query refetch or refresh handler
  const handleRefresh = () => {
    query.refetch();
  };

  const tasks = query.data ?? [];

  // Styles object
  const styles = useMemo(
    () =>
      StyleSheet.create({
        loadingView: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 16,
        },
        loadingText: {
          marginTop: 16,
          ...theme.fonts.bodyMedium,
        },
        errorView: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 16,
        },
        errorMessage: {
          color: theme.colors.error,
          ...theme.fonts.bodyMedium,
        },
        refreshText: {
          color: theme.colors.primary,
          marginTop: 16,
        },
        emptyWrap: {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: 48,
          paddingHorizontal: 16,
        },
        emptyText: {
          textAlign: "center",
          opacity: 0.7,
          ...theme.fonts.bodyMedium,
        },
        separator: { height: 8 },
        listContent: {
          padding: 12,
          paddingBottom: 24,
          flexGrow: tasks.length === 0 ? 1 : 0,
        },
        footerSpacer: {
          height: 8,
        },
      }),
    [theme, tasks.length],
  );

  const SpacingSeparator = useCallback(
    () => <View style={styles.separator} />,
    [styles.separator],
  );

  if (query.isLoading) {
    return (
      <View style={styles.loadingView}>
        <ActivityIndicator />
        <Text style={styles.loadingText}>Loading tasks...</Text>
      </View>
    );
  }

  if (query.isError) {
    const message =
      query.error instanceof Error
        ? query.error.message
        : "Something went wrong";
    return (
      <View style={styles.errorView}>
        <Text style={styles.errorMessage}>Error: {message}</Text>
        <Text style={styles.refreshText} onPress={handleRefresh}>
          Tap to retry
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={tasks}
      renderItem={({ item }) => (
        <SingleTask
          taskId={item.id}
          title={item.title}
          position={item.position}
          description={item.description}
          dueDate={item.dueDate}
          priority={item.priority}
          listId={item.listId}
        />
      )}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyText}>
            You have not created any tasks for this list.
          </Text>
          <Text style={styles.refreshText} onPress={handleRefresh}>
            Tap to refresh
          </Text>
        </View>
      }
      initialNumToRender={4}
      refreshControl={
        <RefreshControl
          refreshing={
            query.isRefetching || (query.isFetching && tasks.length > 0)
          }
          onRefresh={handleRefresh}
          colors={[theme.colors.accent]}
          tintColor={theme.colors.accent}
        />
      }
      ItemSeparatorComponent={SpacingSeparator}
      ListFooterComponent={<View style={styles.footerSpacer} />}
    />
  );
};

export default ShowTasks;
