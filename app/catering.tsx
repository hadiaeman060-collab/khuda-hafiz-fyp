import React from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from "react-native";
import { Stack, useRouter } from "expo-router";

// Import Components
import TopBar from "../components/TopBar";
import BottomNavBar from "../components/BottomNavBar";
import FloatingCallButton from "../components/FloatingAgentButton";

export default function CateringScreen() {
  const router = useRouter();

  const service = {
    name: "Catering",
    desc: "We provide meal arrangements for condolence gatherings, offering hassle-free catering with respectful service to support grieving families.",
    price: 120000, // Set your actual price here
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.container}>
        {/* Top Bar */}
        <TopBar showBack title="Catering" onBackPress={() => router.back()} />

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Catering Image */}
          <Image
            source={require("../assets/images/catering image.png")}
            style={styles.mainImage}
            resizeMode="contain"
          />

          {/* Catering Details */}
          <Text style={styles.title}>{service.name}</Text>
          <Text style={styles.desc}>{service.desc}</Text>

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

          {/* Order Now Button */}
          <TouchableOpacity
            style={styles.orderButton}
            onPress={() =>
              router.push({
                pathname: "/order-details",
                params: {
                  packageName: service.name,
                  items: JSON.stringify([{ name: service.name, price: service.price }]),
                },
              })
            }
          >
            <Text style={styles.orderText}>Order Now</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Floating Call Button */}
        <FloatingCallButton />

        {/* Bottom Nav Bar */}
        <BottomNavBar activeTab="Packages" />
      </View>
    </>
  );
}

//
// Styles
//
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
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
  orderButton: {
    alignSelf: "center",
    backgroundColor: "#5a3d2b",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 30,
    marginBottom: 70,
    elevation: 3,
  },
  orderText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
