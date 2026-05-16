import React from "react";
import { TouchableOpacity, StyleSheet, Image, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const FloatingSearchGraveButton = () => {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => router.push("/searchGrave")}
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
  );
};

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    bottom: 80,
    right: 20,
    width: 65,
    height: 65,
    borderRadius: 40,
    backgroundColor: "#F5E6D3",
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
