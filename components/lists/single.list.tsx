import { StyleSheet, Text, View } from "react-native";
import { useAppTheme } from "@/hooks/theme";
import { useMemo, useRef, useState } from "react";
import { IconButton, Menu } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const SingleList = ({
  id,
  title,
  position,
  status,
  bgColor,
}: {
  id: string;
  title: string;
  position: number;
  status: string;
  bgColor: string;
}) => {
  const theme = useAppTheme();
  const [showMenu, setShowMenu] = useState(false);
  const [anchorPos, setAnchorPos] = useState<{ x: number; y: number } | null>(
    null,
  );
  const lastOpenAt = useRef<number>(0);
  const iconRef = useRef<View>(null);

  const openMenu = () => {
    iconRef?.current?.measureInWindow((x, y, w, h) => {
      setAnchorPos({ x: x + w, y: y + h });
      requestAnimationFrame(() => {
        lastOpenAt.current = Date.now();
        setShowMenu(true);
      });
    });
  };
  const closeMenu = () => setShowMenu(false);

  const handleDismiss = () => {
    if (Date.now() - lastOpenAt.current < 150) return;
    closeMenu();
  };
  // Styles object
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          width: 300,
          height: 520,
          borderColor: bgColor,
          borderWidth: 1,
          borderStyle: "solid",
          borderRadius: 5,
          marginTop: 10,
        },
        heading: {
          ...theme.fonts.headlineSmall,
          textAlign: "center",
          paddingTop: 15,
          color: theme.colors.custom.light,
        },
        headingView: {
          height: 60,
          backgroundColor: bgColor,
          flexGrow: 1,
        },
        contentView: {
          height: 460,
        },
        headingContainer: {
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "row",
        },
        iconButton: {
          flexShrink: 1,
          borderWidth: 0,
          borderRadius: 0,
          margin: 0,
          height: 60,
          backgroundColor: bgColor,
        },
        menuContainer: {
          backgroundColor: theme.colors.custom.light,
        },
        menuItem: {
          ...theme.fonts.bodyMedium,
          textAlign: "center",
          color: bgColor,
        },
        menuDivider: {
          borderBottomColor: bgColor,
          borderBottomWidth: 1,
          paddingBottom: 4,
          marginBottom: -12,
        },
      }),
    [theme, bgColor],
  );

  // Container for each list
  return (
    <View style={styles.container}>
      {/* Header for each list */}
      <View style={styles.headingContainer}>
        {/* Header text */}
        <View style={styles.headingView}>
          <Text style={styles.heading}>{title}</Text>
        </View>
        {/* Header icon */}
        <View ref={iconRef} collapsable={false}>
          <IconButton
            icon="dots-vertical"
            iconColor={theme.colors.background}
            size={30}
            style={styles.iconButton}
            mode="outlined"
            onPress={openMenu}
          />
        </View>

        <Menu
          visible={showMenu}
          anchor={anchorPos ?? { x: 0, y: 0 }}
          anchorPosition="bottom"
          onDismiss={handleDismiss}
          contentStyle={styles.menuContainer}
        >
          <Menu.Item
            title="Edit"
            leadingIcon={() => (
              <MaterialCommunityIcons
                name="file-edit"
                size={24}
                color={bgColor}
              />
            )}
            titleStyle={styles.menuItem}
            containerStyle={styles.menuDivider}
            onPress={closeMenu}
          />
          <Menu.Item
            title="Delete"
            leadingIcon={() => (
              <MaterialCommunityIcons name="delete" size={24} color={bgColor} />
            )}
            onPress={closeMenu}
            titleStyle={styles.menuItem}
          />
        </Menu>
      </View>
    </View>
  );
};
export default SingleList;
