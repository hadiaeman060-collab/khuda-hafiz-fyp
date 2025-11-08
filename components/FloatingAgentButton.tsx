import React from "react";
import { TouchableOpacity, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";

const FloatingAgentButton = () => {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => router.push("/agent")}
    >
      <Image
        source={require("../assets/icons/agent.png")}
        style={styles.icon}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    bottom: 80, // above navbar
    right: 20, // right side
    width: 65,
    height: 65,
    borderRadius: 40,
    backgroundColor: "#F5E6D3", // ✅ light color theme
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    zIndex: 2000,
  },
  icon: {
    width: 32,
    height: 32,
    tintColor: "#5a3d2b", // ✅ dark brown robot
  },
});

export default FloatingAgentButton;
