import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { Stack, useRouter, Link } from "expo-router";
import axios from "axios";
import { useAuth } from "./context/AuthContext";
import { API_URL } from "./utils/config";
import { saveToken } from "./utils/auth";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const auth = useAuth();

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
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Image
              source={require("../assets/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.title}>Log In</Text>
        </View>

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

          {/* Login Button */}
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
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    backgroundColor: "#3c1a06",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  logoCircle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: "#2b0e05",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  logo: { width: "70%", height: "70%" },
  title: { fontSize: 22, fontWeight: "bold", color: "#fff" },
  form: { padding: 20 },
  label: { fontSize: 14, fontWeight: "500", marginBottom: 6, color: "#000" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  forgotPassword: {
    color: "#3c1a06",
    fontSize: 13,
    marginBottom: 20,
    textAlign: "left",
  },
  button: {
    backgroundColor: "#2b0e05",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  line: { flex: 1, height: 1, backgroundColor: "#ddd" },
  orText: { marginHorizontal: 10, color: "#777" },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingVertical: 12,
    justifyContent: "center",
  },
  googleLogo: { width: 20, height: 20, marginRight: 10 },
  googleText: { fontSize: 15 },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  signupText: { color: "#3c1a06", fontWeight: "bold" },
});
