import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { Stack, useRouter } from "expo-router";

export default function OrderConfirmation() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.container}>
        {/* Checkmark Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.checkCircle}>
            <Image
              source={require("../assets/icons/check.png")}
              style={styles.checkIcon}
            />
          </View>
        </View>

        {/* Confirmation Text */}
        <Text style={styles.title}>Your order has been Confirmed</Text>
        <Text style={styles.subtitle}>
          Thank you!{"\n"}Your payment has been processed successfully
        </Text>

        {/* Go to Home Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/home")}
        >
          <Text style={styles.buttonText}>Go to Home</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

//
// Styles
//
const BROWN = "#3b1e0c";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2c1507",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  iconContainer: {
    marginBottom: 30,
  },
  checkCircle: {
    backgroundColor: "#00C851",
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  checkIcon: {
    width: 50,
    height: 50,
    tintColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#ddd",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 22,
  },
  button: {
    backgroundColor: "#5a3d2b",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
