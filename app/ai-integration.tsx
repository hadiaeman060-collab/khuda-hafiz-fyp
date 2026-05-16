import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import TopBar from "../components/TopBar";
import BottomNavBar from "../components/BottomNavBar";
import { palette, radius, shadow, spacing } from "../constants/theme";

export default function AiIntegrationScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.container}>
        <TopBar
          showBack
          title="AI Integration"
          onBackPress={() => router.back()}
          onBellPress={() => router.push("/notifications" as any)}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Image
            source={require("../assets/images/ai-integration-image.png")}
            style={styles.mainImage}
            resizeMode="contain"
          />

          {/* Ai-Integration Details */}
          <Text style={styles.title}>AI Integration & Chatbot Solutions</Text>
          <Text style={styles.desc}>
            Empowering social platforms with intelligent 
            chatbot solutions designed to boost engagement, 
            answer queries instantly, and build stronger, 
            more connected communities
          </Text>

          {/* Ai-Integration Options */}
          <View style={styles.option}>
            <Image
              source={require("../assets/icons/ai-integration-icon1.png")}
              style={styles.optionIcon}
            />
            <Text style={styles.optionText}>Community Engagement Chatbot</Text>
          </View>

          <View style={styles.option}>
            <Image
              source={require("../assets/icons/ai-integration-icon2.png")}
              style={styles.optionIcon}
            />
            <Text style={styles.optionText}>Multilingual Support</Text>
          </View>

          <View style={styles.option}>
            <Image
              source={require("../assets/icons/ai-integration-icon3.png")}
              style={styles.optionIcon}
            />
            <Text style={styles.optionText}>Customizable Contents</Text>
          </View>
        </ScrollView>

        <BottomNavBar activeTab="Home" />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.cream,
  },
  scrollContent: {
    paddingBottom: 112,
  },
  mainImage: {
    width: "100%",
    height: 260,
    marginBottom: 20,
  },
  title: {
    fontSize: 23,
    fontWeight: "900",
    marginHorizontal: spacing.lg,
    marginBottom: 10,
    color: palette.ink,
  },
  desc: {
    fontSize: 14,
    color: palette.muted,
    marginHorizontal: spacing.lg,
    marginBottom: 20,
    lineHeight: 21,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: spacing.lg,
    marginBottom: 12,
    backgroundColor: palette.white,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: palette.border,
    ...shadow.soft,
  },
  optionIcon: {
    width: 28,
    height: 28,
    marginRight: 12,
    tintColor: palette.bronze,
  },
  optionText: {
    fontSize: 14,
    color: palette.ink,
    fontWeight: "700",
    flex: 1,
  },
});
