import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router"; // 👈 import router

export default function SplashScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={["#0d0b0a", "#3c1a06", "#5b2508"]}
      style={styles.container}
    >
      {/* Title */}
      <Text style={styles.title}>Welcome{"\n"}To{"\n"}Khuda Hafiz</Text>

      {/* Circular Logo */}
      <View style={styles.logoCircle}>
        <Image
          source={require("../assets/logo.png")}
          style={styles.logo}
          resizeMode="cover"
        />
      </View>

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        Compassionate and dignified funeral services, bringing care to life’s
        hardest moments.
      </Text>

      {/* Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/signup")} // 👈 navigate to signup.tsx
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
