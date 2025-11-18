import React from "react";
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

export default function PrivacyScreen() {
  const router = useRouter();
  const { width: windowWidth } = useWindowDimensions();

  // prefer a privacy image if present, fall back to a generic illustration
  let heroSrc: any;
  try {
    heroSrc = require("../assets/images/image 27.png");
  } catch (e) {
    try {
      heroSrc = require("../assets/images/ai-integration-image.png");
    } catch (e2) {
      heroSrc = require("../assets/images/icon.png");
    }
  }

  const onLearnMore = () => {
    // placeholder - navigate to a more detailed screen or open external URL
    console.log("Learn more pressed");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color="#3c1a06" />
        </Pressable>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Image
          source={heroSrc}
          style={[
            styles.hero,
            {
              width: Math.min(360, Math.floor(windowWidth * 0.8)),
              height: Math.min(360, Math.floor(windowWidth * 0.8)),
            },
          ]}
        />

        <Text style={styles.bodyText}>
          We value your trust and privacy. Our app does not collect any personal
          data without your consent. All your preferences and information stay
          securely on your device. Inspired by the spirit of Khuda Hafiz — "May
          God protect you" — we are committed to ensuring your experience
          remains safe, private, and respectful at all times.
        </Text>

        <Pressable style={styles.learnBtn} onPress={onLearnMore}>
          <Text style={styles.learnBtnText}>Learn More</Text>
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
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 30,
    alignItems: "center",
  },
  hero: { width: 220, height: 220, resizeMode: "contain", marginBottom: 18 },
  bodyText: {
    textAlign: "center",
    color: "#666",
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 20,
  },
  learnBtn: {
    backgroundColor: "#111",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 120,
    alignItems: "center",
  },
  learnBtnText: { color: "#fff", fontWeight: "700" },
});
