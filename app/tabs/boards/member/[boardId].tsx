import CreateBoardMember from "@/components/boardMembers/create.member";
import { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "@/hooks/theme";
import { useLocalSearchParams } from "expo-router";
import ShowBoardMembers from "@/components/boardMembers/show.members";

const BoardInviteScreen = () => {
  const theme = useAppTheme();
  const { boardId, title } = useLocalSearchParams();
  console.log("Board id", boardId);
  console.log("Title", title);
  // Styles object
  const styles = useMemo(
    () =>
      StyleSheet.create({
        safeArea: {
          flex: 1,
          backgroundColor: theme.colors.background,
        },
        container: {
          flex: 1,
          paddingHorizontal: 20,
          backgroundColor: theme.colors.background,
        },
        content: {
          flex: 1,
        },
        titleText: {
          ...theme.fonts.headlineMedium,
          textAlign: "center",
          paddingBottom: 20,
          flexWrap: "wrap",
          flexShrink: 1,
          paddingTop: 20,
        },
        scrollView: {
          flex: 1,
        },
        scrollContent: {
          flexGrow: 1,
        }
      }),
    [theme],
  );
  return (
    <SafeAreaView edges={["left", "right", "bottom"]} style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.titleText}>{title}</Text>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
          >
            <CreateBoardMember boardId={boardId as string} />
              <ShowBoardMembers boardId={boardId as string} />
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default BoardInviteScreen;
