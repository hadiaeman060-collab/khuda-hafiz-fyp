import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useAuth } from "./context/AuthContext";

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("********");
  const [loggingOut, setLoggingOut] = useState(false);

  // Load user data from auth context
  useEffect(() => {
    if (user) {
      setName(user.displayName || "");
      setEmail(user.email || "");
      setPhone(user.phoneNumber || (user as any).phone || "");
    }
  }, [user]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => {
              router.back();
            }}
          >
            <Ionicons name="chevron-back" size={22} color="#3c1a06" />
          </Pressable>
          <Text style={styles.title}>Your Profile</Text>
        </View>
        <Text style={styles.subtitle}>
          You can update your profile photo and personal details here
        </Text>

        <View style={styles.avatarWrapper}>
          <Image
            source={require("../assets/images/icon.png")}
            style={styles.avatar}
          />
          <Pressable style={styles.cameraButton} onPress={() => {}}>
            <MaterialIcons name="photo-camera" size={18} color="#fff" />
          </Pressable>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            style={styles.input}
            placeholder="Your name"
          />

          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            style={styles.input}
            placeholder="Phone number"
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            placeholder="email@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            placeholder="Password"
            secureTextEntry
          />

          <View style={styles.buttonRow}>
            <Pressable style={styles.primaryButton} onPress={() => {}}>
              <Text style={styles.primaryButtonText}>Edit Profile</Text>
            </Pressable>

            <Pressable
              style={styles.outlineButton}
              onPress={() => router.push("/delete-profile" as any)}
            >
              <Text style={styles.outlineButtonText}>Delete Profile</Text>
            </Pressable>
          </View>
          {/* Logout moved to the app menu modal; removed from profile page */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  // add top spacing so content sits lower and center the headings
  content: { padding: 20, alignItems: "center", paddingTop: 40 },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#3c1a06",
    marginTop: 4,
    textAlign: "center",
  },
  subtitle: { fontSize: 13, color: "#777", textAlign: "center", marginTop: 8 },
  header: { width: "100%", alignItems: "center", justifyContent: "center" },
  backButton: { position: "absolute", left: 0, padding: 6 },
  avatarWrapper: {
    marginTop: 18,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#eee",
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    backgroundColor: "#3c1a06",
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
    transform: [{ translateY: 18 }],
  },
  form: { width: "100%", marginTop: 6 },
  label: { fontSize: 13, color: "#222", marginBottom: 6, marginLeft: 6 },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  primaryButton: {
    backgroundColor: "#3c1a06",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: "center",
  },
  primaryButtonText: { color: "#fff", fontWeight: "600" },
  outlineButton: {
    borderWidth: 1,
    borderColor: "#3c1a06",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    alignItems: "center",
  },
  outlineButtonText: { color: "#3c1a06", fontWeight: "600" },
});
