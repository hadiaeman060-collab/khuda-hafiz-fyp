import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Stack, useRouter } from "expo-router";
import TopBar from "../components/TopBar";
import BottomNavBar from "../components/BottomNavBar";
import FloatingSearchButton from "../components/FloatingSearchGraveButton";

export default function ShroudsScreen() {
  const router = useRouter();

  const [shroudCount, setShroudCount] = useState(1);

  const service = {
    name: "Shroud (Kaffan)",
    desc: "High-quality Islamic burial shrouds for men, women, and children. Choose from standard, customized, or donation-based kaffans.",
    price: 5000, // price per shroud
  };

  const totalPrice = useMemo(() => shroudCount * service.price, [shroudCount, service.price]);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.container}>
        <TopBar showBack title="Shroud (Kaffan)" onBackPress={() => router.back()} />

        <ScrollView showsVerticalScrollIndicator={false}>
          <Image
            source={require("../assets/images/kafan.png")}
            style={styles.mainImage}
            resizeMode="contain"
          />

          <Text style={styles.title}>{service.name}</Text>
          <Text style={styles.price}>
            Price: Rs {service.price.toLocaleString()} per Shroud Kit
          </Text>

          {/* Quantity + Total (same logic as graves) */}
          <View style={styles.countWrap}>
            <Text style={styles.countLabel}>How many shrouds?</Text>

            <View style={styles.stepper}>
              <TouchableOpacity
                style={styles.stepButton}
                onPress={() => setShroudCount((prev) => Math.max(1, prev - 1))}
              >
                <Text style={styles.stepButtonText}>-</Text>
              </TouchableOpacity>

              <Text style={styles.countValue}>{shroudCount}</Text>

              <TouchableOpacity
                style={styles.stepButton}
                onPress={() => setShroudCount((prev) => prev + 1)}
              >
                <Text style={styles.stepButtonText}>+</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.totalText}>Total: Rs {totalPrice.toLocaleString()}</Text>
          </View>

          <Text style={styles.desc}>{service.desc}</Text>

          <View style={styles.option}>
            <Image source={require("../assets/icons/icon1.png")} style={styles.optionIcon} />
            <Text style={styles.optionText}>100% Pure Cotton (White)</Text>
          </View>

          <View style={styles.option}>
            <Image source={require("../assets/icons/icon2.png")} style={styles.optionIcon} />
            <Text style={styles.optionText}>Prepared as per Islamic Sunnah</Text>
          </View>

          <View style={styles.option}>
            <Image source={require("../assets/icons/icon3.png")} style={styles.optionIcon} />
            <Text style={styles.optionText}>Includes: Izaar, Qamees & Lifafa</Text>
          </View>

          <TouchableOpacity
            style={styles.orderButton}
            onPress={() => {
              if (shroudCount < 1) {
                Alert.alert("Invalid Quantity", "Please select at least 1 shroud.");
                return;
              }

              router.push({
                pathname: "/order-details",
                params: {
                  packageName: service.name,
                  items: JSON.stringify([
                    { name: `${service.name} (${shroudCount})`, price: totalPrice },
                  ]),
                },
              });
            }}
          >
            <Text style={styles.orderText}>Order Now</Text>
          </TouchableOpacity>
        </ScrollView>

        <FloatingSearchButton />
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
  countWrap: {
    marginHorizontal: 15,
    marginBottom: 20,
  },
  countLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  stepButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
  },
  stepButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#5a3d2b",
  },
  countValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  totalText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#5a3d2b",
    textAlign: "center",
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


