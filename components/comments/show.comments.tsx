import { GetCommentsService } from "@/services/comment.service";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { View, StyleSheet, ActivityIndicator, Text } from "react-native";
import { useAppTheme } from "@/hooks/theme";
import SingleComment from "./single.comment";

const ShowComments = ({ taskId }: { taskId: string }) => {
  const theme = useAppTheme();
  const query = useQuery({
    queryKey: ["comments", taskId],
    queryFn: async () => await GetCommentsService(taskId),
    enabled: !!taskId,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
    staleTime: 30_000,
    gcTime: 5 * 60 * 1000,
  });

  // Query refetch or refresh handler
  const handleRefresh = () => {
    query.refetch();
  };

  const comments = query.data ?? [];

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
          paddingBottom: 16,
        },
      }),
    [theme],
  );

  if (query.isLoading) {
    return (
      <View style={styles.loadingView}>
        <ActivityIndicator />
        <Text style={styles.loadingText}>Loading comments...</Text>
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
    <View>
      {comments.length === 0 ? (
        <Text style={styles.emptyWrap}>
          You have not created any comments for this task
        </Text>
      ) : (
        comments?.map((item) => (
          <SingleComment
            id={item.id}
            content={item.content}
            createdAt={item.createdAt}
            updatedAt={item.updatedAt}
            key={item.id}
            taskId={taskId}
          />
        ))
      )}
    </View>
  );
};

export default ShowComments;
