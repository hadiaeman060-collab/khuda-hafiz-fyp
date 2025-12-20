import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter, Link } from "expo-router";
import axios from "axios";
import { useAuth } from "./context/AuthContext";
import { API_URL } from "./utils/config";
import AuthUtils from "./utils/auth";

export default function VerifyEmailScreen() {
  const router = useRouter();
  const { email: emailParam } = useLocalSearchParams<{ email?: string }>();
  const [email, setEmail] = useState<string>(
    typeof emailParam === "string" ? emailParam : ""
  );
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(
    "An OTP has been sent to your email."
  );
  const [pending, setPending] = useState<{
    displayName?: string;
    phone?: string;
    password?: string;
  } | null>(null);
  const auth = useAuth();
  const BACKEND_URL = API_URL;

  useEffect(() => {
    async function loadPending() {
      try {
        const data = await AuthUtils.getToken("pendingSignup");
        if (data) {
          const parsed = JSON.parse(data);
          // Prefer email from params, fall back to stored
          if (!email && parsed?.email) setEmail(parsed.email);
          setPending({
            displayName: parsed?.displayName,
            phone: parsed?.phone,
            password: parsed?.password,
          });
        }
      } catch (e) {
        console.warn("Failed to read pendingSignup payload", e);
      }
    }
    loadPending();
  }, []);

  async function handleVerify() {
    setError(null);
    if (!email) return setError("Email is required");
    if (!otp) return setError("Please enter the OTP");

    // Ensure we have necessary details to complete signup
    if (!pending?.password || !pending?.displayName) {
      return setError(
        "Missing signup details. Please go back and fill the form again."
      );
    }

    setLoading(true);
    try {
      const resp = await axios.post(`${BACKEND_URL}/signup`, {
        email,
        otp,
        password: pending.password,
        displayName: pending.displayName,
        extra: { phone: pending.phone },
      });

      const tokenObj = resp.data?.token;
      const profile = resp.data?.profile;
      await auth.signIn(tokenObj, profile);

      // Clear pending signup data
      try {
        await AuthUtils.saveToken("pendingSignup", "");
      } catch {}

      router.replace("/home");
    } catch (err: any) {
      console.error("Verify failed", err?.response?.data || err.message || err);
      const message =
        err?.response?.data?.error ||
        err?.response?.data?.detail ||
        err.message ||
        "Verification failed";
      setError(typeof message === "string" ? message : JSON.stringify(message));
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setError(null);
    if (!email) return setError("Email is required to resend OTP");
    setLoading(true);
    try {
      const resp = await axios.post(`${BACKEND_URL}/signup`, { email });
      if (resp.data?.ok) {
        setInfo("OTP resent. Please check your inbox.");
      } else {
        setError(resp.data?.error || "Failed to resend OTP");
      }
    } catch (err: any) {
      console.error(
        "Resend OTP failed",
        err?.response?.data || err.message || err
      );
      const message =
        err?.response?.data?.error ||
        err?.response?.data?.detail ||
        err.message ||
        "Resend OTP failed";
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
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Image
              source={require("../assets/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.title}>Verify Email</Text>
          <Text style={styles.subtitle}>Enter the OTP sent to your email</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />

          <Text style={styles.label}>OTP</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter 6-digit OTP"
            keyboardType="number-pad"
            value={otp}
            onChangeText={setOtp}
            maxLength={6}
          />
          {info ? (
            <Text style={{ color: "#2b0e05", marginBottom: 8 }}>{info}</Text>
          ) : null}
          {error ? (
            <Text style={{ color: "red", marginBottom: 8 }}>{error}</Text>
          ) : null}

          <TouchableOpacity
            style={[styles.button, loading ? { opacity: 0.7 } : null]}
            onPress={handleVerify}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Verifying..." : "Verify & Create Account"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleResend} disabled={loading}>
            <Text
              style={{
                color: "#2b0e05",
                textAlign: "center",
                marginBottom: 12,
              }}
            >
              {loading ? "Resending..." : "Resend OTP"}
            </Text>
          </TouchableOpacity>

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Entered wrong email? </Text>
            <Link href="/signup" style={styles.loginLink}>
              Go back
            </Link>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const CIRCLE_SIZE = 100;
const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: "#fff" },
  header: {
    backgroundColor: "#3c1a06",
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 20,
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
    marginBottom: 10,
  },
  logo: { width: "70%", height: "70%" },
  title: { fontSize: 22, fontWeight: "bold", color: "#fff", marginTop: 5 },
  subtitle: { fontSize: 14, color: "#fff", marginTop: 3 },
  form: { padding: 20 },
  label: { fontSize: 14, fontWeight: "500", marginBottom: 6, color: "#000" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#2b0e05",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  loginRow: { flexDirection: "row", justifyContent: "center" },
  loginText: { fontSize: 13, color: "#444" },
  loginLink: {
    fontSize: 13,
    color: "#2b0e05",
    fontWeight: "bold",
    textDecorationLine: "none",
  },
});
