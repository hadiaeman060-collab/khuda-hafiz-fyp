import React, { useEffect, useMemo, useRef } from "react";
import {
  Animated,
  Image,
  PanResponder,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const BUTTON_SIZE = 65;
const EDGE_PADDING = 16;

const FloatingSearchGraveButton = () => {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const initialPosition = useMemo(
    () => ({
      x: Math.max(EDGE_PADDING, width - BUTTON_SIZE - 20),
      y: Math.max(EDGE_PADDING, height - BUTTON_SIZE - 150),
    }),
    [height, width]
  );
  const position = useRef(new Animated.ValueXY(initialPosition)).current;
  const latestPosition = useRef(initialPosition);

  const clampPosition = (next: { x: number; y: number }) => ({
    x: Math.min(
      Math.max(EDGE_PADDING, next.x),
      Math.max(EDGE_PADDING, width - BUTTON_SIZE - EDGE_PADDING)
    ),
    y: Math.min(
      Math.max(EDGE_PADDING, next.y),
      Math.max(EDGE_PADDING, height - BUTTON_SIZE - EDGE_PADDING)
    ),
  });

  useEffect(() => {
    const listenerId = position.addListener((value) => {
      latestPosition.current = value;
    });

    return () => position.removeListener(listenerId);
  }, [position]);

  useEffect(() => {
    const clamped = clampPosition(latestPosition.current);
    position.setValue(clamped);
    latestPosition.current = clamped;
  }, [height, width]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_event, gesture) =>
          Math.abs(gesture.dx) > 6 || Math.abs(gesture.dy) > 6,
        onPanResponderGrant: () => {
          position.setOffset(latestPosition.current);
          position.setValue({ x: 0, y: 0 });
        },
        onPanResponderMove: Animated.event(
          [null, { dx: position.x, dy: position.y }],
          { useNativeDriver: false }
        ),
        onPanResponderRelease: () => {
          position.flattenOffset();
          const clamped = clampPosition(latestPosition.current);
          position.setValue(clamped);
          latestPosition.current = clamped;
        },
        onPanResponderTerminate: () => {
          position.flattenOffset();
          const clamped = clampPosition(latestPosition.current);
          position.setValue(clamped);
          latestPosition.current = clamped;
        },
      }),
    [height, position, width]
  );

  return (
    <Animated.View
      style={[
        styles.button,
        {
          transform: position.getTranslateTransform(),
        },
      ]}
      {...panResponder.panHandlers}
    >
      <TouchableOpacity
        style={styles.pressable}
        onPress={() => router.push("/searchGrave")}
        activeOpacity={0.86}
      >
        <Image
          source={require("../assets/icons/grave.png")}
          style={styles.icon}
        />
        <View style={styles.searchBar}>
          <Ionicons name="search" size={9} color="#5a3d2b" />
          <View style={styles.searchLine} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    top: 0,
    left: 0,
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: 40,
    backgroundColor: "#F5E6D3",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    zIndex: 2000,
  },
  pressable: {
    width: "100%",
    height: "100%",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 30,
    height: 30,
    tintColor: "#5a3d2b",
  },
  searchBar: {
    position: "absolute",
    right: 6,
    bottom: 8,
    width: 34,
    height: 14,
    borderRadius: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d6c4ad",
    flexDirection: "row",
    paddingHorizontal: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  searchLine: {
    width: 12,
    height: 1,
    backgroundColor: "#b59a7b",
    marginLeft: 3,
  },
});

export default FloatingSearchGraveButton;
