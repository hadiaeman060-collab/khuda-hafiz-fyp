import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  Image,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function TermsScreen() {
  const router = useRouter();
  const { width: windowWidth } = useWindowDimensions();
  const [agreed, setAgreed] = useState(false);

  // prefer a terms image if present
  let heroSrc: any;
  try {
    heroSrc = require("../assets/images/image 28.png");
  } catch (e) {
    try {
      heroSrc = require("../assets/images/ai-integration-image.png");
    } catch (e2) {
      heroSrc = require("../assets/images/icon.png");
    }
  }

  const onAgree = () => {
    if (!agreed) return;
    // placeholder: navigate or store acceptance
    console.log("Terms accepted");
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color="#3c1a06" />
        </Pressable>
        <Text style={styles.headerTitle}>Terms & Conditions</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Image
          source={heroSrc}
          style={[
            styles.hero,
            {
              width: Math.min(300, Math.floor(windowWidth * 0.6)),
              height: Math.min(300, Math.floor(windowWidth * 0.6)),
            },
          ]}
        />

        <Text style={styles.introText}>
          To keep your experience smooth, secure, and aligned with our Terms &
          Conditions and Privacy Policy. Please review them and agree to
          continue using the app.
        </Text>

        <View style={styles.bullets}>
          <View style={styles.bulletRow}>
            <View style={styles.bulletIcon}>
              <Ionicons name="star" size={14} color="#3c1a06" />
            </View>
            <View style={styles.bulletTextWrap}>
              <Text style={styles.bulletTitle}>Fair Use</Text>
              <Text style={styles.bulletBody}>
                Use the app respectfully and for personal, lawful purposes only.
              </Text>
            </View>
          </View>

          <View style={styles.bulletRow}>
            <View style={styles.bulletIcon}>
              <Ionicons name="document" size={14} color="#3c1a06" />
            </View>
            <View style={styles.bulletTextWrap}>
              <Text style={styles.bulletTitle}>Content</Text>
              <Text style={styles.bulletBody}>
                All content belongs to KhudaHafiz and may not be copied or
                reused without permission.
              </Text>
            </View>
          </View>

          <View style={styles.bulletRow}>
            <View style={styles.bulletIcon}>
              <Ionicons name="lock-closed" size={14} color="#3c1a06" />
            </View>
            <View style={styles.bulletTextWrap}>
              <Text style={styles.bulletTitle}>Privacy</Text>
              <Text style={styles.bulletBody}>
                We don't collect personal data without your consent. See our
                Privacy Policy.
              </Text>
            </View>
          </View>

          <View style={styles.bulletRow}>
            <View style={styles.bulletIcon}>
              <Ionicons name="sync" size={14} color="#3c1a06" />
            </View>
            <View style={styles.bulletTextWrap}>
              <Text style={styles.bulletTitle}>Updates</Text>
              <Text style={styles.bulletBody}>
                Terms may change. Continued use means you accept the updates.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.checkboxRow}>
          <Pressable
            style={[styles.checkbox, agreed && styles.checkboxChecked]}
            onPress={() => setAgreed((s) => !s)}
          >
            {agreed ? (
              <Ionicons name="checkmark" size={16} color="#fff" />
            ) : null}
          </Pressable>
          <Text style={styles.checkboxLabel}>
            I have read and agree to the Terms.
          </Text>
        </View>

        <Pressable
          style={[styles.agreeBtn, !agreed && styles.agreeBtnDisabled]}
          onPress={onAgree}
          disabled={!agreed}
        >
          <Text style={styles.agreeBtnText}>I Agree</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
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
  content: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
    alignItems: "center",
  },
  hero: { resizeMode: "contain", marginBottom: 12 },
  introText: {
    textAlign: "center",
    color: "#444",
    fontSize: 13,
    marginBottom: 12,
  },
  bullets: { width: "100%", marginTop: 8 },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  bulletIcon: { width: 30, alignItems: "center", marginTop: 4 },
  bulletTextWrap: { flex: 1 },
  bulletTitle: { fontWeight: "600", color: "#111", marginBottom: 4 },
  bulletBody: { color: "#666", fontSize: 13 },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
    width: "100%",
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  checkboxChecked: { backgroundColor: "#3c1a06", borderColor: "#3c1a06" },
  checkboxLabel: { marginLeft: 10, color: "#444", flex: 1 },
  agreeBtn: {
    marginTop: 18,
    backgroundColor: "#3c1a06",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 120,
    alignItems: "center",
  },
  agreeBtnDisabled: { opacity: 0.5 },
  agreeBtnText: { color: "#fff", fontWeight: "700" },
});
