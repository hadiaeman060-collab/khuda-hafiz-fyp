import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function TollFreeScreen() {
  const router = useRouter();
  // Prefer `assets/images/logo.png` (your provided logo). If it's not present,
  // fall back to the existing `icon.png` so the app doesn't crash.
  let logoSrc: any;
  try {
    // Place your logo file at `assets/images/logo.png` to use it here.
    logoSrc = require("../assets/logo.png");
  } catch (e) {
    logoSrc = require("../assets/images/icon.png");
  }

  const onCall = () => {
    // placeholder - integrate Linking.openURL('tel:0800786786') when ready
    console.log("Call Now");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color="#3c1a06" />
        </Pressable>
        <Text style={styles.headerTitle}>Toll Free Number</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.introRow}>
          <View style={styles.logoCircle}>
            <Image source={logoSrc} style={styles.logoImage} />
          </View>
          <View style={styles.introTextWrap}>
            <Text style={styles.introTitle}>In Your Time of Need</Text>
            <Text style={styles.introSub}>Available 24/7 for support</Text>
          </View>
        </View>

        <View style={{ height: 12 }} />

        <Text style={styles.sectionMain}>Reach Out to us</Text>
        <Text style={styles.sectionSub}>Your comfort is our priority</Text>

        <View style={{ height: 18 }} />

        <View style={styles.infoRow}>
          <View style={styles.infoLeft}>
            <View style={styles.iconBg}>
              <Ionicons name="call-outline" size={18} color="#3c1a06" />
            </View>
            <View>
              <Text style={styles.infoLabel}>Toll-Free Number</Text>
            </View>
          </View>
          <Text style={styles.infoValue}>0800-786-786</Text>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoLeft}>
            <View style={styles.iconBg}>
              <Ionicons name="time-outline" size={18} color="#3c1a06" />
            </View>
            <View style={styles.infoTextCol}>
              <Text style={styles.infoLabel}>Availability</Text>
              <Text style={styles.infoSmall}>Always available</Text>
            </View>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoLeft}>
            <View style={styles.iconBg}>
              <Ionicons name="globe-outline" size={18} color="#3c1a06" />
            </View>
            <View>
              <Text style={styles.infoLabel}>Website</Text>
            </View>
          </View>
          <Text style={styles.infoValue}>www.Khudahafiz.biz</Text>
        </View>

        <View style={{ height: 40 }} />

        <Pressable style={styles.callBtn} onPress={onCall}>
          <Text style={styles.callBtnText}>Call Now</Text>
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
    paddingHorizontal: 14,
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
  content: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 30 },
  introRow: {
    marginTop: 6,
    marginBottom: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  introTextWrap: { marginLeft: 12, flex: 1 },
  introTitle: { fontSize: 14, fontWeight: "600", color: "#111" },
  introSub: { fontSize: 12, color: "#777", marginTop: 6 },
  sectionMain: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "700",
    color: "#3c1a06",
  },
  sectionSub: { fontSize: 13, color: "#777", marginTop: 6 },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: "#f0e9e2",
  },
  infoLeft: { flexDirection: "row", alignItems: "center" },
  iconBg: {
    width: 36,
    height: 36,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    backgroundColor: "#fff8f2",
    borderWidth: 1,
    borderColor: "#f3e7dc",
  },
  infoLabel: { fontSize: 14, color: "#3c1a06", fontWeight: "600" },
  infoValue: { fontSize: 14, color: "#333" },
  infoTextCol: { flexDirection: "column" },
  infoSmall: { fontSize: 13, color: "#777", marginTop: 4 },
  logoCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#3c1a06",
    alignItems: "center",
    justifyContent: "center",
  },
  logoImage: {
    width: 80,
    height: 80,
    tintColor: "#fff",
    resizeMode: "contain",
  },
  callBtn: {
    backgroundColor: "#3c1a06",
    alignSelf: "center",
    paddingVertical: 12,
    paddingHorizontal: 26,
    borderRadius: 8,
    minWidth: 140,
    alignItems: "center",
  },
  callBtnText: { color: "#fff", fontWeight: "700", fontSize: 14 },
});
