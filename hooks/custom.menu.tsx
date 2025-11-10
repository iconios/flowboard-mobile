import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  Pressable,
  StyleSheet,
  View,
  ViewProps,
} from "react-native";
import { Menu, Portal, Text } from "react-native-paper";

type MenuItem = {
  key?: string;
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  destructive?: boolean;
  leadingIcon?: string;
};

type Props = {
  items: MenuItem[];
  children: React.ReactNode; // your IconButton (no onPress)
  width?: number;
  placement?: "auto" | "top" | "bottom";
  onOpenChange?: (open: boolean) => void;
  anchorOffsetY?: number;
  anchorOffsetX?: number;
  triggerProps?: ViewProps;
};

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

export default function PaperMeasuredMenu({
  items,
  children,
  width = 220,
  placement = "auto",
  onOpenChange,
  anchorOffsetY = 6,
  anchorOffsetX = 0,
  triggerProps,
}: Props) {
  const [visible, setVisible] = useState(false);
  const [coordAnchor, setCoordAnchor] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [useElementAnchor, setUseElementAnchor] = useState(false);
  const triggerRef = useRef<View>(null);
  const ghostRef = useRef<View>(null);
  const ignoreDismissUntil = useRef<number>(0);

  const open = useCallback(() => {
    requestAnimationFrame(() => {
      const node = triggerRef.current;
      if (!node) {
        ignoreDismissUntil.current = Date.now() + 250;
        setVisible(true);
        onOpenChange?.(true);
        return;
      }
      node.measureInWindow((x, y, w, h) => {
        let ax = x + anchorOffsetX;
        let ay = y + h + anchorOffsetY;

        const maxLeft = SCREEN_W - width - 8;
        if (ax > maxLeft) ax = Math.max(8, maxLeft);
        if (ax < 8) ax = 8;

        const estimatedHeight = Math.max(items.length * 48, 48);
        const fitsBelow = ay + estimatedHeight + 8 <= SCREEN_H;
        const fitsAbove = y - estimatedHeight - 8 >= 0;
        if (
          placement === "top" ||
          (placement === "auto" && !fitsBelow && fitsAbove)
        ) {
          ay = y - estimatedHeight - 8;
        }
        if (ay < 8) ay = 8;

        // try coordinate anchor first
        setCoordAnchor({ x: ax, y: ay });
        setUseElementAnchor(false);
        ignoreDismissUntil.current = Date.now() + 250;
        setVisible(true);
        onOpenChange?.(true);

        // Safety net: if the menu doesn't become visible on next tick, flip to element anchor
        setTimeout(() => {
          // if user tapped backdrop and it closed, skip
          if (!visible && !coordAnchor) return;
          // If still not showing (some builds ignore {x,y}), enable fallback
          setUseElementAnchor(true);
        }, 0);
      });
    });
  }, [
    onOpenChange,
    anchorOffsetX,
    anchorOffsetY,
    items.length,
    placement,
    width,
    coordAnchor,
    visible,
  ]);

  const close = useCallback(() => {
    setVisible(false);
    onOpenChange?.(false);
  }, [onOpenChange]);

  const handleDismiss = useCallback(() => {
    if (Date.now() < ignoreDismissUntil.current) return;
    close();
  }, [close]);

  const menuContentStyle = useMemo(
    () => [{ width }, styles.menuSurface],
    [width],
  );

  return (
    <>
      <Pressable
        ref={triggerRef}
        onPress={open}
        accessibilityRole="button"
        hitSlop={8}
        {...triggerProps}
        // @ts-ignore keep native node for measurement
        collapsable={false}
        style={triggerProps?.style}
      >
        {children}
      </Pressable>

      {/* Ghost anchor (fallback for older RNP / broken coordinate anchors) */}
      <Portal>
        {useElementAnchor && coordAnchor && visible && (
          <View
            ref={ghostRef}
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFill,
              {
                top: coordAnchor.y,
                left: coordAnchor.x,
                width: 1,
                height: 1,
                position: "absolute",
              },
            ]}
          />
        )}
      </Portal>

      <Portal>
        <Menu
          visible={visible}
          onDismiss={handleDismiss}
          anchor={
            useElementAnchor && coordAnchor ? (
              // element anchor fallback
              <View style={{ width: 1, height: 1 }} />
            ) : (
              // coordinate anchor (preferred)
              (coordAnchor ?? { x: 0, y: 0 })
            )
          }
          anchorPosition={placement === "top" ? "top" : "bottom"}
          contentStyle={menuContentStyle}
        >
          {items.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No actions</Text>
            </View>
          ) : (
            items.map((item, idx) => (
              <Menu.Item
                key={item.key ?? `${idx}-${item.title}`}
                title={item.title}
                onPress={() => {
                  if (item.disabled) return;
                  close();
                  requestAnimationFrame(() => item.onPress?.());
                }}
                disabled={item.disabled}
                leadingIcon={item.leadingIcon}
                titleStyle={[
                  styles.itemTitle,
                  item.destructive && styles.destructive,
                ]}
              />
            ))
          )}
        </Menu>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  menuSurface: { borderRadius: 12 },
  itemTitle: { fontSize: 16 },
  destructive: { color: "#C62828" },
  empty: { paddingVertical: 12, paddingHorizontal: 16 },
  emptyText: { opacity: 0.6 },
});
