import React from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from "react-native";
import { Stack, useRouter } from "expo-router";
import TopBar from "../components/TopBar";
import BottomNavBar from "../components/BottomNavBar";
import FloatingSearchButton from "../components/FloatingSearchGraveButton";

export default function EmotionalSupportScreen() {
  const router = useRouter();

  const service = {
    name: "Emotional Support",
    desc: "We connect grieving families with professional therapists for counseling and emotional support, helping them navigate loss with care and compassion.",
    price: 3000, // Set your actual price here
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.container}>
        {/* Top Bar */}
        <TopBar showBack title="Emotional Support" onBackPress={() => router.back()} />

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Support Image */}
          <Image
            source={require("../assets/images/support.png")}
            style={styles.mainImage}
            resizeMode="contain"
          />

          {/* Support Details */}
          <Text style={styles.title}>{service.name}</Text>
          <Text style={styles.price}>Price: Rs {service.price.toLocaleString()}</Text>
          <Text style={styles.desc}>{service.desc}</Text>

          {/* Support Options */}
          <View style={styles.option}>
            <Image
              source={require("../assets/icons/guidance.png")}
              style={styles.optionIcon}
            />
            <Text style={styles.optionText}>Guidance for Grieving Families</Text>
          </View>

          <View style={styles.option}>
            <Image
              source={require("../assets/icons/talk-to-scholar.png")}
              style={styles.optionIcon}
            />
            <Text style={styles.optionText}>Talk to a Scholar</Text>
          </View>

          <View style={styles.option}>
            <Image
              source={require("../assets/icons/islamic-counseling.png")}
              style={styles.optionIcon}
            />
            <Text style={styles.optionText}>Grief Counseling (Islamic)</Text>
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
        <FloatingSearchButton />

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


