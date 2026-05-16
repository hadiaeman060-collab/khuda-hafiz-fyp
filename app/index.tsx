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
      colors={["#160804", "#3c1a06", "#8b5a32"]}
      style={styles.container}
    >
      <Text style={styles.kicker}>Compassion, care, clarity</Text>
      <Text style={styles.title}>Khuda Hafiz</Text>

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
    fontSize: 42,
    fontWeight: "900",
    textAlign: "center",
    color: "#fff",
    marginBottom: 28,
    lineHeight: 48,
  },
  kicker: {
    color: "#f3d390",
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase",
    marginBottom: 10,
  },
  logoCircle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
    overflow: "hidden",
    backfaceVisibility: "hidden", // prevents mirror showing
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.24)",
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
    backgroundColor: "#fff8ef",
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 999,
  },
  buttonText: {
    color: "#3c1a06",
    fontWeight: "900",
    fontSize: 16,
  },
});
