import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { Stack } from "expo-router";
import axios from "axios";
import { API_URL } from "./utils/config";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  React.useEffect(() => {
    console.log("ForgotPassword screen mounted");
    return () => console.log("ForgotPassword unmounted");
  }, []);

  function isValidEmail(e: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  }

  return (
    <>
      {/* Hide header */}
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
          <Text style={styles.title}>Forget Password</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.label}>Enter your Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          {/* Add top margin before button */}
          {message ? (
            <Text style={{ marginBottom: 12, color: "green" }}>{message}</Text>
          ) : null}
          <TouchableOpacity
            style={[styles.button, { marginTop: 40 }]}
            onPress={async () => {
              setMessage(null);
              if (!isValidEmail(email))
                return setMessage("Please enter a valid email");
              setLoading(true);
              try {
                const resp = await axios.post(`${API_URL}/reset-password`, {
                  email,
                });
                setMessage(
                  resp.data?.message ||
                    "If an account exists you will receive a reset email"
                );
              } catch (err: any) {
                console.error(
                  "Reset request failed",
                  err?.response || err?.message || err
                );
                const msg =
                  err?.response?.data?.error ||
                  err?.response?.data?.detail ||
                  err.message ||
                  "Request failed";
                setMessage(typeof msg === "string" ? msg : JSON.stringify(msg));
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Sending..." : "Send Email"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const CIRCLE_SIZE = 100;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
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
  logo: {
    width: "70%",
    height: "70%",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  form: {
    padding: 20,
    marginTop: 40, // <-- space between header and input
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 6,
    color: "#000",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#2b0e05",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
