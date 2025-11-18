import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  Pressable,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function WalletScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<"connected" | "not" | null>(
    "connected"
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color="#3c1a06" />
        </Pressable>
        <Text style={styles.headerTitle}>Wallet</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Image
          source={require("../assets/images/wallet.png")}
          style={styles.illustration}
          resizeMode="contain"
        />

        <Text style={styles.mainTitle}>
          To get started, we need to check if your wallet is connected.
        </Text>
        <Text style={styles.subtitle}>
          Please confirm below so we can take you to the right place.
        </Text>

        <View style={styles.options}>
          <Pressable
            style={styles.optionRow}
            onPress={() => setSelected("connected")}
          >
            <View
              style={[
                styles.radioOuter,
                selected === "connected" && styles.radioOuterActive,
              ]}
            >
              {selected === "connected" && <View style={styles.radioInner} />}
            </View>
            <Text style={styles.optionLabel}>Connected</Text>
          </Pressable>

          <Pressable
            style={styles.optionRow}
            onPress={() => setSelected("not")}
          >
            <View
              style={[
                styles.radioOuter,
                selected === "not" && styles.radioOuterActive,
              ]}
            >
              {selected === "not" && <View style={styles.radioInner} />}
            </View>
            <Text style={styles.optionLabel}>Not Connected</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
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
  content: { padding: 20, alignItems: "center", paddingTop: 24 },
  illustration: { width: 160, height: 160, marginBottom: 18 },
  mainTitle: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "left",
    width: "100%",
    color: "#111",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: "#666",
    textAlign: "left",
    width: "100%",
    marginBottom: 16,
  },
  options: { width: "100%", marginTop: 6 },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#999",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  radioOuterActive: { borderColor: "#3c1a06" },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#3c1a06",
  },
  optionLabel: { fontSize: 14, color: "#222" },
});
