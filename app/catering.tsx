import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";

// Import Components
import TopBar from "../components/TopBar";
import BottomNavBar from "../components/BottomNavBar";
import FloatingSearchButton from "../components/FloatingSearchGraveButton";

export default function CateringScreen() {
  const router = useRouter();
  const [peopleCountInput, setPeopleCountInput] = useState("");
  const [dishSelection, setDishSelection] = useState<
    "" | "dish1" | "dish2" | "both"
  >("");

  const service = {
    name: "Catering",
    desc: "We provide meal arrangements for condolence gatherings, offering hassle-free catering with respectful service to support grieving families.",
  };

  const peopleCount = useMemo(() => {
    const parsed = parseInt(peopleCountInput, 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  }, [peopleCountInput]);

  const perPersonPrice = dishSelection === "both" ? 1000 : 500;
  const selectedDishLabel = useMemo(() => {
    if (dishSelection === "dish1") return "2 Dishes & Roti";
    if (dishSelection === "dish2") return "Rice, Chicken & Roti (Customizable)";
    if (dishSelection === "both") return "Both Dishes";
    return "";
  }, [dishSelection]);
  const totalPrice = peopleCount * perPersonPrice;

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
          <Text style={styles.price}>
            Price: Rs {perPersonPrice.toLocaleString()} per person
          </Text>
          <View style={styles.inputWrap}>
            <Text style={styles.inputLabel}>Select Dishes</Text>
            <View style={styles.pickerWrap}>
              <Picker
                selectedValue={dishSelection}
                onValueChange={(value) => setDishSelection(value)}
              >
                <Picker.Item label="Select dish type" value="" />
                <Picker.Item label="2 Dishes & Roti" value="dish1" />
                <Picker.Item
                  label="Rice, Chicken & Roti (Customizable)"
                  value="dish2"
                />
                <Picker.Item label="Both Dishes" value="both" />
              </Picker>
            </View>
            <Text style={styles.inputLabel}>Number of People</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter number of people"
              keyboardType="number-pad"
              value={peopleCountInput}
              onChangeText={(text) => setPeopleCountInput(text.replace(/[^0-9]/g, ""))}
            />
            <Text style={styles.totalText}>
              Total: Rs {totalPrice.toLocaleString()}
            </Text>
          </View>
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
            onPress={() => {
              if (!dishSelection) {
                Alert.alert("Select Dishes", "Please select required dishes.");
                return;
              }
              if (!peopleCount) {
                Alert.alert("Enter People Count", "Please enter number of people.");
                return;
              }
              router.push({
                pathname: "/order-details",
                params: {
                  packageName: service.name,
                  items: JSON.stringify([
                    {
                      name: `${service.name} - ${selectedDishLabel} (${peopleCount} people)`,
                      price: totalPrice,
                    },
                  ]),
                },
              });
            }}
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
  container: { flex: 1, backgroundColor: "#fff8ef" },
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
    marginBottom: 8,
  },
  inputWrap: {
    marginHorizontal: 15,
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 13,
    color: "#333",
    marginBottom: 6,
  },
  pickerWrap: {
    borderWidth: 1,
    borderColor: "#d9d9d9",
    borderRadius: 16,
    backgroundColor: "#fff",
    marginBottom: 10,
    overflow: "hidden",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d9d9d9",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#222",
    backgroundColor: "#fff",
  },
  totalText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "600",
    color: "#5a3d2b",
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


