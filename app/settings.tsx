import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Switch,
  Pressable,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function SettingsScreen() {
  const router = useRouter();
  const [notification, setNotification] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color="#3c1a06" />
        </Pressable>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Pressable style={styles.rowCard} onPress={() => {}}>
          <View style={styles.rowLeft}>
            <View style={[styles.rowIconBg, { backgroundColor: "#fff8f2" }]}>
              <Ionicons
                name="notifications-outline"
                size={18}
                color="#3c1a06"
              />
            </View>
            <Text style={styles.rowLabel}>Notification</Text>
          </View>
          <Switch
            value={notification}
            onValueChange={setNotification}
            thumbColor={notification ? "#fff" : "#fff"}
            trackColor={{ false: "#ddd", true: "#3c1a06" }}
          />
        </Pressable>

        <Pressable style={styles.rowCard} onPress={() => {}}>
          <View style={styles.rowLeft}>
            <View style={[styles.rowIconBg, { backgroundColor: "#fff8f2" }]}>
              <Ionicons name="sunny-outline" size={18} color="#3c1a06" />
            </View>
            <Text style={styles.rowLabel}>Dark Mode</Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            thumbColor={darkMode ? "#fff" : "#fff"}
            trackColor={{ false: "#ddd", true: "#3c1a06" }}
          />
        </Pressable>

        <Pressable
          style={styles.rowCard}
          onPress={() => setLanguageOpen((s) => !s)}
        >
          <View style={styles.rowLeft}>
            <View style={[styles.rowIconBg, { backgroundColor: "#fff8f2" }]}>
              <Ionicons name="globe-outline" size={18} color="#3c1a06" />
            </View>
            <Text style={styles.rowLabel}>Languages Switch</Text>
          </View>
          <View style={styles.rowRight}>
            <Text style={styles.rowSmall}>English</Text>
            <Ionicons
              name={languageOpen ? "chevron-up" : "chevron-down"}
              size={20}
              color="#777"
            />
          </View>
        </Pressable>

        <Pressable
          style={styles.rowCard}
          onPress={() => router.push("/payment-method" as any)}
        >
          <View style={styles.rowLeft}>
            <View style={[styles.rowIconBg, { backgroundColor: "#eef9f3" }]}>
              <MaterialIcons name="credit-card" size={18} color="#3c1a06" />
            </View>
            <Text style={styles.rowLabel}>Payment Method</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#777" />
        </Pressable>

        <Pressable
          style={styles.rowCard}
          onPress={() => router.push("/feedback" as any)}
        >
          <View style={styles.rowLeft}>
            <View style={[styles.rowIconBg, { backgroundColor: "#fff8f2" }]}>
              <Ionicons name="star-outline" size={18} color="#3c1a06" />
            </View>
            <Text style={styles.rowLabel}>Feedback</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#777" />
        </Pressable>

        <Pressable
          style={styles.rowCard}
          onPress={() => console.log("Share App")}
        >
          <View style={styles.rowLeft}>
            <View style={[styles.rowIconBg, { backgroundColor: "#fff8f2" }]}>
              <Ionicons name="share-social-outline" size={18} color="#3c1a06" />
            </View>
            <Text style={styles.rowLabel}>Share App</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#777" />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff8ef" },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
    color: "#3c1a06",
  },
  content: { padding: 16 },
  rowCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#f0e9e2",
  },
  rowLabel: { fontSize: 14, color: "#111", fontWeight: "600" },
  rowLeft: { flexDirection: "row", alignItems: "center" },
  rowIconBg: {
    width: 36,
    height: 36,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#f3e7dc",
  },
  rowRight: { flexDirection: "row", alignItems: "center" },
  rowSmall: { marginRight: 8, color: "#777" },
});
