import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import { Stack, useRouter } from "expo-router";

// Import Components
import TopBar from "../components/TopBar";
import BottomNavBar from "../components/BottomNavBar";
import FloatingCallButton from "../components/FloatingAgentButton";

export default function CateringScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.container}>
        {/* ✅ Top Bar Component */}
        <TopBar />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
          
          {/* Catering Image */}
          <Image
            source={require("../assets/images/catering image.png")}
            style={styles.mainImage}
            resizeMode="contain"
          />

          {/* Catering Details */}
          <Text style={styles.title}>Catering</Text>
          <Text style={styles.desc}>
            We provide the meal arrangements for condolence 
            gatherings, offering hassle-free catering with 
            respectful service to support grieving families.
          </Text>

          {/* Catering Options */}
          <View style={styles.option}>
            <Image
              source={require("../assets/icons/catering-icon1.png")}
              style={styles.optionIcon}
            />
            <Text style={styles.optionText}>2 Dishes & Roti</Text>
          </View>

          <View style={styles.option}>
            <Image
              source={require("../assets/icons/catering-icon2.png")}
              style={styles.optionIcon}
            />
            <Text style={styles.optionText}>Rice, Chicken & Roti (Customizable)</Text>
          </View>

          <View style={styles.option}>
            <Image
              source={require("../assets/icons/icon2.png")}
              style={styles.optionIcon}
            />
            <Text style={styles.optionText}>Hygienic, Fresh & Sunnah-conscious</Text>
          </View>
        </ScrollView>

        {/* ✅ Floating Call Button */}
        <FloatingCallButton />

        {/* ✅ Bottom Navigation */}
        <BottomNavBar activeTab="Home" />
      </View>
    </>
  );
}

//
// Styles
//
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  mainImage: {
    width: "100%",
    height: 260,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 15,
    marginBottom: 10,
    color: "#000",
  },
  desc: {
    fontSize: 14,
    color: "#444",
    marginHorizontal: 15,
    marginBottom: 20,
    lineHeight: 20,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 15,
    marginBottom: 15,
  },
  optionIcon: {
    width: 28,
    height: 28,
    marginRight: 12,
    tintColor: "#8B4513",
  },
  optionText: {
    fontSize: 14,
    color: "#333",
  },
});
