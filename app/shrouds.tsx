import React from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from "react-native";
import { Stack, useRouter } from "expo-router";
import TopBar from "../components/TopBar";
import BottomNavBar from "../components/BottomNavBar";
import FloatingSearchButton from "../components/FloatingSearchGraveButton";

export default function ShroudsScreen() {
  const router = useRouter();

  const service = {
    name: "Shroud (Kaffan)",
    desc: "High-quality Islamic burial shrouds for men, women, and children. Choose from standard, customized, or donation-based kaffans.",
    price: 5000, // Set your actual price here
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.container}>
        {/* Top Bar */}
        <TopBar showBack title="Shroud (Kaffan)" onBackPress={() => router.back()} />

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Shroud Image */}
          <Image
            source={require("../assets/images/kafan.png")}
            style={styles.mainImage}
            resizeMode="contain"
          />

          {/* Shroud Details */}
          <Text style={styles.title}>{service.name}</Text>
          <Text style={styles.price}>Price: Rs {service.price.toLocaleString()}</Text>
          <Text style={styles.desc}>{service.desc}</Text>

          {/* Shroud Options */}
          <View style={styles.option}>
            <Image
              source={require("../assets/icons/icon1.png")}
              style={styles.optionIcon}
            />
            <Text style={styles.optionText}>100% Pure Cotton (White)</Text>
          </View>

          <View style={styles.option}>
            <Image
              source={require("../assets/icons/icon2.png")}
              style={styles.optionIcon}
            />
            <Text style={styles.optionText}>Prepared as per Islamic Sunnah</Text>
          </View>

          <View style={styles.option}>
            <Image
              source={require("../assets/icons/icon3.png")}
              style={styles.optionIcon}
            />
            <Text style={styles.optionText}>Includes: Izaar, Qamees & Lifafa</Text>
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

        {/* Floating Agent Button */}
        <FloatingSearchButton />

        {/* Bottom Nav Bar */}
        <BottomNavBar activeTab="Packages" />
      </View>
    </>
  );
}

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
    marginBottom: 6,
    color: "#000",
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
    color: "#5a3d2b",
    marginHorizontal: 15,
    marginBottom: 10,
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


