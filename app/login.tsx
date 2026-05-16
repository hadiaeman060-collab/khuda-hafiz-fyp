import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter, Link } from "expo-router";
import axios from "axios";
import { useAuth } from "./context/AuthContext";
import { API_URL } from "../utils/config";
import { saveToken } from "../utils/auth";
import { palette, radius, shadow, spacing } from "../constants/theme";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const auth = useAuth();

  // Backend URL comes from centralized config
  const BACKEND_URL = API_URL;

  function handleForgotPassword() {
    console.log("Forgot password pressed");
    try {
      router.push("/forgot-password");
    } catch (e) {
      console.error("Navigation to forgot-password failed", e);
    }
  }

  async function handleLogin() {
    setError(null);
    if (!email || !password) {
      return setError("Email and password required");
    }
    setLoading(true);
    try {
      console.log("Login: BACKEND_URL =", BACKEND_URL);
      // Step 1: Request OTP after validating credentials
      const resp = await axios.post(`${BACKEND_URL}/login`, {
        email,
        password,
      });

      if (!resp.data?.ok) {
        return setError(resp.data?.error || "Failed to request OTP");
      }

      // Step 2: Store pending login details securely
      try {
        await saveToken("pendingLogin", JSON.stringify({ email, password }));
      } catch (e) {
        console.warn("Failed to persist pending login details", e);
      }

      // Step 3: Navigate to verify screen
      router.push({ pathname: "/verify-login", params: { email } });
    } catch (err: any) {
      console.error("Login failed", {
        message: err?.message,
        code: err?.code,
        request: err?.request,
        response: err?.response?.data || err?.response,
      });

      // Friendly Firebase error messages
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error?.message ||
        err.message ||
        "Login failed";

      setError(typeof message === "string" ? message : JSON.stringify(message));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.container}>
        {/* Header */}
        <LinearGradient
          colors={["#2b1208", "#3c1a06", "#7a4a2a"]}
          style={styles.header}
        >
          <View style={styles.logoCircle}>
            <Image
              source={require("../assets/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Continue arranging care with calm.</Text>
        </LinearGradient>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {/* Forgot Password */}
          <TouchableOpacity
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            onPress={async () => {
              console.log("Forgot password pressed (programmatic)");
              try {
                await router.push("/forgot-password");
                console.log("router.push succeeded");
              } catch (e) {
                console.warn("router.push failed, trying replace", e);
                try {
                  await router.replace("/forgot-password");
                  console.log("router.replace succeeded");
                } catch (e2) {
                  console.error("router.replace also failed", e2);
                }
              }
            }}
          >
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </TouchableOpacity>

          {error ? (
            <Text style={{ color: "red", marginBottom: 8 }}>{error}</Text>
          ) : null}

          {/* Login button */}
          <TouchableOpacity
            style={[styles.button, loading ? { opacity: 0.7 } : null]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Logging in..." : "Login"}
            </Text>
          </TouchableOpacity>

          {/* OR Separator */}
          <View style={styles.orContainer}>
            <View style={styles.line} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.line} />
          </View>

          {/* Google Login */}
          <TouchableOpacity style={styles.googleButton}>
            <Image
              source={require("../assets/google.png")}
              style={styles.googleLogo}
            />
            <Text style={styles.googleText}>Continue with Google</Text>
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View style={styles.signupContainer}>
            <Text>Don’t have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/signup")}>
              <Text style={styles.signupText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
}

const CIRCLE_SIZE = 100;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: palette.cream },
  header: {
    alignItems: "center",
    paddingTop: 58,
    paddingBottom: 46,
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
    overflow: "hidden",
  },
  logoCircle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.24)",
  },
  logo: { width: "70%", height: "70%" },
  title: { fontSize: 28, fontWeight: "900", color: "#fff" },
  subtitle: {
    color: "#f7efe4",
    fontSize: 14,
    marginTop: 6,
    fontWeight: "600",
  },
  form: {
    margin: spacing.lg,
    marginTop: -22,
    padding: spacing.lg,
    borderRadius: radius.xl,
    backgroundColor: "rgba(255,255,255,0.97)",
    borderWidth: 1,
    borderColor: palette.border,
    ...shadow.medium,
  },
  label: {
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 6,
    color: palette.brown,
  },
  input: {
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
    backgroundColor: palette.cream,
    color: palette.ink,
  },
  forgotPassword: {
    color: palette.mahogany,
    fontSize: 13,
    marginBottom: 20,
    textAlign: "left",
    fontWeight: "800",
  },
  button: {
    backgroundColor: palette.mahogany,
    paddingVertical: 14,
    borderRadius: radius.pill,
    alignItems: "center",
    ...shadow.glow,
  },
  buttonText: { color: "#fff", fontWeight: "900", fontSize: 16 },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  line: { flex: 1, height: 1, backgroundColor: palette.border },
  orText: { marginHorizontal: 10, color: palette.faint, fontWeight: "800" },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radius.pill,
    paddingVertical: 12,
    justifyContent: "center",
    backgroundColor: palette.white,
  },
  googleLogo: { width: 20, height: 20, marginRight: 10 },
  googleText: { fontSize: 15, color: palette.ink, fontWeight: "700" },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  signupText: { color: palette.mahogany, fontWeight: "900" },
});
