import { GetBoardMembersService } from "@/services/board.members.service";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { View, ActivityIndicator, StyleSheet, Text } from "react-native";
import { useAppTheme } from "@/hooks/theme";
import SingleMember from "./single.member";

const ShowBoardMembers = ({ boardId }: { boardId: string }) => {
  const theme = useAppTheme();
  const query = useQuery({
    queryKey: ["members", boardId],
    queryFn: async ({ signal }) =>
      await GetBoardMembersService(boardId, { signal }),
    enabled: !!boardId,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
    staleTime: 30_000,
    gcTime: 5 * 60 * 1000,
  });

  // Query refetch or refresh handler
  const handleRefresh = () => {
    query.refetch();
  };

  const members = query.data ?? [];

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
        container: {
          flex: 1,
          minHeight: 200,
          backgroundColor: theme.colors.background,
          marginTop: 16,
          paddingHorizontal: 10,
        },
      }),
    [theme],
  );

  if (query.isLoading) {
    return (
      <View style={styles.loadingView}>
        <ActivityIndicator />
        <Text style={styles.loadingText}>Loading members...</Text>
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
    <View style={styles.container}>
      {members.length > 0 ? (
        members.map((member) => (
          <SingleMember member={member} key={member.memberId} />
        ))
      ) : (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyText}>No members found for this board.</Text>
          <Text style={styles.refreshText} onPress={handleRefresh}>
            Tap to refresh
          </Text>
        </View>
      )}
    </View>
  );
};

export default ShowBoardMembers;
