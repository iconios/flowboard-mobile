import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Divider, Icon, IconButton } from "react-native-paper";
import { useAppTheme } from "@/hooks/theme";

export const CustomMenu = ({
  editOpen,
  deleteOpen,
  color,
}: {
  editOpen: () => void;
  deleteOpen: () => void;
  color: string;
}) => {
  const theme = useAppTheme();
  const [openMenu, setOpenMenu] = useState(false);

  const handleEditOpen = () => {
    setOpenMenu(false);
    editOpen();
  };

  const handleDeleteOpen = () => {
    setOpenMenu(false);
    deleteOpen();
  };

  return (
    <View style={styles.container}>
      <View style={styles.menuView}>
        <IconButton
          icon="dots-vertical"
          size={30}
          mode="outlined"
          iconColor="white"
          style={[styles.iconButton, { backgroundColor: color }]}
          onPress={() => setOpenMenu(true)}
        />
      </View>

      {openMenu && (
        <Pressable style={styles.overlay} onPress={() => setOpenMenu(false)}>
          {/* Menu positioned relative to parent */}
          <View style={styles.menuContainer}>
            <View style={styles.menuContent}>
              <Pressable style={styles.pressable} onPress={handleEditOpen}>
                <Icon size={20} source="pencil" color={color} />
                <Text style={{ color, ...theme.fonts.bodySmall }}>
                  Update List
                </Text>
              </Pressable>

              <Divider style={{ outlineColor: color }} />

              <Pressable style={styles.pressable} onPress={handleDeleteOpen}>
                <Icon size={20} source="delete" color={color} />
                <Text style={{ color, ...theme.fonts.bodySmall }}>
                  Delete List
                </Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignItems: "flex-end",
  },
  menuView: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
    zIndex: 1300,
  },
  menuContainer: {
    position: "absolute",
    top: 60,
    right: 0,
  },
  menuContent: {
    backgroundColor: "white",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  pressable: {
    justifyContent: "flex-start",
    gap: 8,
    flexDirection: "row",
    paddingHorizontal: 15,
    paddingVertical: 15,
    width: 150,
  },
  iconButton: {
    flexShrink: 1,
    borderWidth: 0,
    borderRadius: 0,
    margin: 0,
    height: 60,
  },
});
