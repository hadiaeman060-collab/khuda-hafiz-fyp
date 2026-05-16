import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import TopBar from "../components/TopBar";
import BottomNavBar from "../components/BottomNavBar";
import FloatingSearchButton from "../components/FloatingSearchGraveButton";
import { getCities, getGraveyardsByCity } from "../src/utils/graveyardAPI";

type GraveyardApi = {
  _id: string;
  name: string;
  address: string;
  city: string;
};

export default function GraveScreen() {
  const router = useRouter();
  const [graveCount, setGraveCount] = useState(1);
  const [loadingCities, setLoadingCities] = useState(true);
  const [loadingGraveyards, setLoadingGraveyards] = useState(false);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [graveyards, setGraveyards] = useState<GraveyardApi[]>([]);
  const [selectedGraveyardId, setSelectedGraveyardId] = useState("");

  const service = {
    name: "Grave",
    desc: "Grave selection, purchase, and digging service.",
    price: 40000,
  };

  useEffect(() => {
    (async () => {
      try {
        setLoadingCities(true);
        const cityList = await getCities();
        setCities(cityList);
      } catch (err: any) {
        Alert.alert("Error", err.message || "Failed to load cities");
      } finally {
        setLoadingCities(false);
      }
    })();
  }, []);

  const onSelectCity = async (city: string) => {
    setSelectedCity(city);
    setSelectedGraveyardId("");

    if (!city) {
      setGraveyards([]);
      return;
    }

    try {
      setLoadingGraveyards(true);
      const list = await getGraveyardsByCity(city);
      setGraveyards(list);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to load graveyards");
    } finally {
      setLoadingGraveyards(false);
    }
  };

  const selectedGraveyard = useMemo(
    () => graveyards.find((g) => g._id === selectedGraveyardId),
    [graveyards, selectedGraveyardId]
  );
  const totalPrice = useMemo(() => graveCount * service.price, [graveCount]);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.container}>
        <TopBar showBack title="Grave Services" onBackPress={() => router.back()} />

        <ScrollView showsVerticalScrollIndicator={false}>
          <Image
            source={require("../assets/images/grave-detail.png")}
            style={styles.mainImage}
            resizeMode="contain"
          />

          <Text style={styles.title}>{service.name}</Text>
          <Text style={styles.price}>
            Price: Rs {service.price.toLocaleString()} per grave
          </Text>

          <View style={styles.countWrap}>
            <Text style={styles.countLabel}>How many graves?</Text>
            <View style={styles.stepper}>
              <TouchableOpacity
                style={styles.stepButton}
                onPress={() => setGraveCount((prev) => Math.max(1, prev - 1))}
              >
                <Text style={styles.stepButtonText}>-</Text>
              </TouchableOpacity>

              <Text style={styles.countValue}>{graveCount}</Text>

              <TouchableOpacity
                style={styles.stepButton}
                onPress={() => setGraveCount((prev) => prev + 1)}
              >
                <Text style={styles.stepButtonText}>+</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.totalText}>Total: Rs {totalPrice.toLocaleString()}</Text>
          </View>

          <View style={styles.graveyardWrap}>
            <Text style={styles.graveyardLabel}>Select city to see available graveyards</Text>
            <View style={styles.pickerCard}>
              {loadingCities ? (
                <View style={styles.rowCenter}>
                  <ActivityIndicator size="small" color="#5a3d2b" />
                  <Text style={styles.loadingInlineText}>Loading cities...</Text>
                </View>
              ) : (
                <Picker selectedValue={selectedCity} onValueChange={onSelectCity}>
                  <Picker.Item label="-- Select City --" value="" />
                  {cities.map((city) => (
                    <Picker.Item key={city} label={city} value={city} />
                  ))}
                </Picker>
              )}
            </View>

            {loadingGraveyards ? (
              <View style={styles.rowCenter}>
                <ActivityIndicator size="small" color="#5a3d2b" />
                <Text style={styles.loadingInlineText}>Fetching graveyards...</Text>
              </View>
            ) : selectedCity ? (
              graveyards.length === 0 ? (
                <Text style={styles.noGraveyardText}>
                  No available graveyards found in {selectedCity}.
                </Text>
              ) : (
                <View style={styles.pickerCard}>
                  <Picker
                    selectedValue={selectedGraveyardId}
                    onValueChange={(value) => setSelectedGraveyardId(value)}
                  >
                    <Picker.Item label="-- Select Graveyard --" value="" />
                    {graveyards.map((g) => (
                      <Picker.Item key={g._id} label={g.name} value={g._id} />
                    ))}
                  </Picker>
                </View>
              )
            ) : (
              <Text style={styles.noGraveyardText}>
                Select a city first to view graveyards.
              </Text>
            )}
          </View>

          <Text style={styles.desc}>
            We assist in grave selection, purchasing, and digging to ensure a
            smooth burial process. Our service includes reserved plots and
            immediate arrangements.
          </Text>

          <View style={styles.option}>
            <Image
              source={require("../assets/icons/earthen.png")}
              style={styles.optionIcon}
            />
            <Text style={styles.optionText}>Earthen, according to Sunnah</Text>
          </View>

          <View style={styles.option}>
            <Image
              source={require("../assets/icons/islamic-grave.png")}
              style={styles.optionIcon}
            />
            <Text style={styles.optionText}>Standard Islamic Grave</Text>
          </View>

          <View style={styles.option}>
            <Image
              source={require("../assets/icons/planks.png")}
              style={styles.optionIcon}
            />
            <Text style={styles.optionText}>Grave Digging and Planks</Text>
          </View>

          <TouchableOpacity
            style={styles.orderButton}
            onPress={() => {
              if (graveCount < 1) {
                Alert.alert("Invalid Quantity", "Please select at least 1 grave.");
                return;
              }
              if (!selectedGraveyard) {
                Alert.alert("Select Graveyard", "Please select a graveyard first.");
                return;
              }

              router.push({
                pathname: "/order-details",
                params: {
                  packageName: service.name,
                  deliveryAddress: selectedGraveyard.address,
                  items: JSON.stringify([
                    { name: `${service.name} (${graveCount})`, price: totalPrice },
                    { name: `Graveyard: ${selectedGraveyard.name}`, price: 0 },
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
  countWrap: {
    marginHorizontal: 15,
    marginBottom: 12,
    alignItems: "center",
  },
  countLabel: {
    fontSize: 13,
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "#d9d9d9",
    borderRadius: 16,
    overflow: "hidden",
  },
  stepButton: {
    width: 38,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7f3ed",
  },
  stepButtonText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#5a3d2b",
    lineHeight: 22,
  },
  countValue: {
    minWidth: 48,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
    color: "#2d2d2d",
  },
  totalText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "600",
    color: "#5a3d2b",
    textAlign: "center",
  },
  graveyardWrap: {
    marginHorizontal: 15,
    marginBottom: 12,
  },
  graveyardLabel: {
    fontSize: 13,
    color: "#333",
    marginBottom: 8,
  },
  pickerCard: {
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  loadingInlineText: {
    marginLeft: 10,
    color: "#666",
    fontSize: 13,
  },
  noGraveyardText: {
    marginTop: 8,
    fontSize: 12,
    color: "#777",
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
