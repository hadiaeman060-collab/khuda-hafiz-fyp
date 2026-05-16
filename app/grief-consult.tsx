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

export default function GriefConsultationScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.container}>
        <TopBar
          showBack
          title="Grief Consult"
          onBackPress={() => router.back()}
          onBellPress={() => router.push("/notifications" as any)}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Image
            source={require("../assets/images/grief.png")}
            style={styles.mainImage}
            resizeMode="contain"
          />

          {/* Grief-Consult Details */}
          <Text style={styles.title}>Grief Counselling Resources</Text>
          <Text style={styles.desc}>
            Professional counseling support, spiritual guidance, 
            and practical resources to help families navigate 
            grief, loss, and burial arrangements during difficult 
            times.
          </Text>

          {/* Grief-Consult Options */}
          <View style={styles.option}>
            <Image
              source={require("../assets/icons/grief-consult-icon1.png")}
              style={styles.optionIcon}
            />
            <Text style={styles.optionText}>Islamic Grief Support</Text>
          </View>

          <View style={styles.option}>
            <Image
              source={require("../assets/icons/grief-consult-icon2.png")}
              style={styles.optionIcon}
            />
            <Text style={styles.optionText}>Guided Dua & Supplications for Healing</Text>
          </View>

          <View style={styles.option}>
            <Image
              source={require("../assets/icons/grief-consult-icon3.png")}
              style={styles.optionIcon}
            />
            <Text style={styles.optionText}>Islamic perspective on loss and patience
                (sabr)</Text>
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
