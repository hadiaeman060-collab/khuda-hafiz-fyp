import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Easing,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

export default function SplashScreen() {
  const router = useRouter();
  const flipAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(flipAnim, {
        toValue: 2,
        duration: 1000, // adjust speed (lower = faster)
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  // Interpolate rotation for a flip effect
  const rotateY = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <LinearGradient
      colors={["#0d0b0a", "#3c1a06", "#5b2508"]}
      style={styles.container}
    >
      <Text style={styles.title}>Welcome{"\n"}To{"\n"}Khuda Hafiz</Text>

      <Animated.View
        style={[
          styles.logoCircle,
          { transform: [{ rotateY }] }, // 👈 flip animation
        ]}
      >
        <Image
          source={require("../assets/logo.png")}
          style={styles.logo}
          resizeMode="cover"
        />
      </Animated.View>

      <Text style={styles.subtitle}>
        Compassionate and dignified funeral services, bringing care to life’s
        hardest moments.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/signup")}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const CIRCLE_SIZE = 200;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#fff",
    marginBottom: 40,
    lineHeight: 34,
  },
  logoCircle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: "#1a0a04",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
    overflow: "hidden",
    backfaceVisibility: "hidden", // prevents mirror showing
  },
  logo: {
    width: "100%",
    height: "100%",
  },
  subtitle: {
    fontSize: 14,
    color: "#fff",
    textAlign: "center",
    marginHorizontal: 20,
    marginBottom: 40,
    lineHeight: 20,
  },
  button: {
    backgroundColor: "#2b0e05",
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 12,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
