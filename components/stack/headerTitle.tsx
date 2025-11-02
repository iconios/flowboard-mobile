import { useAppTheme } from "@/hooks/theme";
import { View, StyleSheet, Image, Text } from "react-native";

const HeaderTitle = () => {
  const theme = useAppTheme();

  const styles = StyleSheet.create({
    header: {
      justifyContent: "center",
      flexDirection: "row",
      paddingHorizontal: 20,
    },
    image: {
      width: 50,
      height: 50,
      resizeMode: "contain",
    },
    flowBoardText: {
      fontFamily: theme.fonts.titleSmall.fontFamily,
      fontSize: theme.fonts.titleSmall.fontSize,
      fontWeight: theme.fonts.titleSmall.fontWeight,
      fontStyle: theme.fonts.titleSmall.fontStyle,
      color: theme.colors.text,
      marginLeft: 10,
    },
  });

  return (
    <View style={styles.header}>
      <Image
        source={require("../../assets/images/logo.png")}
        style={styles.image}
      />
      <Text style={styles.flowBoardText}>FlowBoard</Text>
    </View>
  );
};

export default HeaderTitle;
