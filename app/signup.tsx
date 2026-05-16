import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Checkbox from "expo-checkbox";
import { Stack, Link, useRouter } from "expo-router";
import axios from "axios";
import { useAuth } from "./context/AuthContext";
// Updated import to use Expo public env variable
import { API_URL } from "../utils/config";
import { saveToken } from "../utils/auth";
import { palette, radius, shadow, spacing } from "../constants/theme";

export default function SignupScreen() {
  const router = useRouter();
  const [isChecked, setChecked] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const auth = useAuth();

  // Backend URL now correctly reads EXPO_PUBLIC_API_URL
  const BACKEND_URL = API_URL;

  async function handleSignup() {
    setError(null);
    // Validate details before requesting OTP
    if (!name || !email || !password || !confirm) {
      return setError("Name, email, and password are required");
    }
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) return setError("Please enter a valid email");
    if (password !== confirm) return setError("Passwords do not match");

    setLoading(true);
    try {
      // Step 1: Request OTP to be sent to the user's email
      const resp = await axios.post(`${BACKEND_URL}/signup`, { email });
      if (!resp.data?.ok) {
        return setError(resp.data?.error || "Failed to request OTP");
      }

      // Step 2: Persist pending signup details securely, then navigate to verify screen
      try {
        // Store pending details to retrieve on verify screen
        await saveToken(
          "pendingSignup",
          JSON.stringify({
            email,
            displayName: name,
            phone,
            password,
          })
        );
      } catch (e) {
        console.warn("Failed to  persist pending signup details", e);
      }

      // Navigate to verify email screen with only the email in params
      router.push({ pathname: "/verify-email", params: { email } });
    } catch (err: any) {
      console.error(
        "Request OTP failed",
        err?.response?.data || err.message || err
      );
      const message =
        err?.response?.data?.error ||
        err?.response?.data?.detail ||
        err.message ||
        "Request OTP failed";
      setError(typeof message === "string" ? message : JSON.stringify(message));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
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
          <Text style={styles.title}>Create account</Text>
          <Text style={styles.subtitle}>Start with a secure Khuda Hafiz profile</Text>
        </LinearGradient>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />

          {/* OTP moved to dedicated Verify Email screen */}

          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            placeholder="Enter password"
            value={password}
            onChangeText={setPassword}
          />

          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            placeholder="Re-enter password"
            value={confirm}
            onChangeText={setConfirm}
          />

          {/* Checkbox */}
          <View style={styles.checkboxContainer}>
            <Checkbox
              value={isChecked}
              onValueChange={setChecked}
              color="#2b0e05"
            />
            <Text style={styles.checkboxText}>
              I agree to the Terms & Conditions
            </Text>
          </View>

          {/* Sign Up / Request OTP Button */}
          {error ? (
            <Text style={{ color: "red", marginBottom: 8 }}>{error}</Text>
          ) : null}
          <TouchableOpacity
            style={[styles.button, loading ? { opacity: 0.7 } : null]}
            onPress={handleSignup}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Requesting..." : "Sign Up"}
            </Text>
          </TouchableOpacity>
          {/* OR */}
          <Text style={styles.orText}>OR</Text>

          {/* Google Button */}
          <TouchableOpacity style={styles.googleButton}>
            <Image
              source={require("../assets/google.png")}
              style={styles.googleLogo}
            />
            <Text style={styles.googleText}>Continue with Google</Text>
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <Link href="/login" style={styles.loginLink}>
              Login
            </Link>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

// Styles (unchanged)
const CIRCLE_SIZE = 100;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: palette.cream,
  },
  header: {
    alignItems: "center",
    paddingTop: 46,
    paddingBottom: 38,
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
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.24)",
  },
  logo: {
    width: "70%",
    height: "70%",
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#f7efe4",
    marginTop: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#fff",
    marginTop: 3,
  },
  form: {
    margin: spacing.lg,
    marginTop: -20,
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
    marginBottom: 15,
    backgroundColor: palette.cream,
    color: palette.ink,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  checkboxText: {
    marginLeft: 8,
    fontSize: 12,
    color: palette.muted,
  },
  button: {
    backgroundColor: palette.mahogany,
    paddingVertical: 14,
    borderRadius: radius.pill,
    alignItems: "center",
    marginBottom: 15,
    ...shadow.glow,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 16,
  },
  orText: {
    textAlign: "center",
    marginBottom: 15,
    color: palette.faint,
    fontWeight: "800",
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radius.pill,
    paddingVertical: 12,
    marginBottom: 20,
    backgroundColor: palette.white,
  },
  googleLogo: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  googleText: {
    fontSize: 14,
    fontWeight: "500",
    color: palette.ink,
  },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
  loginText: {
    fontSize: 13,
    color: palette.muted,
  },
  loginLink: {
    fontSize: 13,
    color: palette.mahogany,
    fontWeight: "900",
    textDecorationLine: "none",
  },
});
