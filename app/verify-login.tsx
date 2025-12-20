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

export default function VerifyLoginScreen() {
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
  const [pending, setPending] = useState<{ password?: string } | null>(null);
  const auth = useAuth();
  const BACKEND_URL = API_URL;

  useEffect(() => {
    async function loadPending() {
      try {
        const data = await AuthUtils.getToken("pendingLogin");
        if (data) {
          const parsed = JSON.parse(data);
          if (!email && parsed?.email) setEmail(parsed.email);
          setPending({ password: parsed?.password });
        }
      } catch (e) {
        console.warn("Failed to read pendingLogin payload", e);
      }
    }
    loadPending();
  }, []);

  async function handleVerify() {
    setError(null);
    if (!email) return setError("Email is required");
    if (!otp) return setError("Please enter the OTP");

    if (!pending?.password) {
      return setError("Missing login details. Please go back and login again.");
    }

    setLoading(true);
    try {
      const resp = await axios.post(`${BACKEND_URL}/login`, {
        email,
        password: pending.password,
        otp,
      });

      const tokenObj = resp.data?.token;
      const profile = resp.data?.profile;
      await auth.signIn(tokenObj, profile);

      // Clear pending login data
      try {
        await AuthUtils.saveToken("pendingLogin", "");
      } catch {}

      router.replace("/home");
    } catch (err: any) {
      console.error(
        "Verify login failed",
        err?.response?.data || err.message || err
      );
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
    if (!email || !pending?.password)
      return setError("Missing login details. Please go back and login again.");
    setLoading(true);
    try {
      const resp = await axios.post(`${BACKEND_URL}/login`, {
        email,
        password: pending.password,
      });
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
          <Text style={styles.title}>Verify Login</Text>
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
              {loading ? "Verifying..." : "Verify & Login"}
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
            <Text style={styles.loginText}>Entered wrong credentials? </Text>
            <Link href="/login" style={styles.loginLink}>
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
