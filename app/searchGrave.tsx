import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Linking,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import * as Location from "expo-location";

// ✅ Make sure this relative path matches where this file lives.
// If your screen is app/(tabs)/graveyardSearch.tsx, use "../../src/utils/graveyardAPI"
import { getCities, getGraveyardsByCity, getNearbyGraveyards } from "../src/utils/graveyardAPI";

type GraveyardApi = {
  _id: string;
  name: string;
  address: string;
  city: string;
  contactNumber?: string;
  location?: { type: "Point"; coordinates: [number, number] }; // [lng, lat]
};

const BROWN = "#5a3d2b";

export default function GraveyardSearchScreen() {
  const router = useRouter();

  const [loadingCities, setLoadingCities] = useState(true);
  const [loadingList, setLoadingList] = useState(false);

  const [cities, setCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [searchMode, setSearchMode] = useState<"city" | "nearby" | null>(null);
  const [detectedPlace, setDetectedPlace] = useState<string>("");

  const [graveyards, setGraveyards] = useState<GraveyardApi[]>([]);

  useEffect(() => {
    (async () => {
      try {
        setLoadingCities(true);
        const cities = await getCities();
        setCities(cities);
      } catch (err: any) {
        console.error(err);
        Alert.alert("Error", err.message || "Failed to load cities");
      } finally {
        setLoadingCities(false);
      }
    })();
  }, []);

  const onSelectCity = async (city: string) => {
    setSearchMode("city");
    setDetectedPlace("");
    setSelectedCity(city);

    if (!city) {
      setGraveyards([]);
      return;
    }

    try {
      setLoadingList(true);
      const list = await getGraveyardsByCity(city);
      setGraveyards(list);
    } catch (err: any) {
      console.error(err);
      Alert.alert("Error", err.message || "Failed to load graveyards");
    } finally {
      setLoadingList(false);
    }
  };

  const resolveNearestKnownCity = (rawPlace: string, knownCities: string[]) => {
    const normalizedRaw = rawPlace.toLowerCase().trim();
    return knownCities.find((c) => {
      const normalizedCity = c.toLowerCase().trim();
      return (
        normalizedRaw === normalizedCity ||
        normalizedRaw.includes(normalizedCity) ||
        normalizedCity.includes(normalizedRaw)
      );
    });
  };

  const onSearchNearby = async () => {
    try {
      setLoadingList(true);
      setSearchMode("nearby");
      setSelectedCity("");
      setDetectedPlace("");

      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status !== "granted") {
        Alert.alert("Permission required", "Allow location access to search nearby graveyards.");
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      const places = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
      const place = places?.[0];
      const locationText =
        place?.city ||
        place?.subregion ||
        place?.region ||
        place?.district ||
        "";
      setDetectedPlace(locationText);

      const matchedCity = locationText ? resolveNearestKnownCity(locationText, cities) : undefined;
      if (matchedCity) {
        const cityList = await getGraveyardsByCity(matchedCity);
        setSelectedCity(matchedCity);
        setGraveyards(cityList);
        return;
      }

      const nearby = await getNearbyGraveyards(lat, lng, 15000);
      setGraveyards(nearby);
    } catch (err: any) {
      console.error(err);
      Alert.alert("Error", err.message || "Failed to load nearby graveyards");
    } finally {
      setLoadingList(false);
    }
  };

  const handleCall = (phone?: string) => {
    if (!phone) {
      Alert.alert("No Contact", "No contact number available for this graveyard.");
      return;
    }
    Linking.openURL(`tel:${phone}`).catch(() =>
      Alert.alert("Error", "Unable to make a call")
    );
  };

  const handleOpenMap = (g: GraveyardApi) => {
    const coords = g.location?.coordinates;
    if (!coords || coords.length !== 2) {
      Alert.alert("No Location", "No coordinates available for this graveyard.");
      return;
    }
    const [lng, lat] = coords;
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    Linking.openURL(url).catch(() => Alert.alert("Error", "Unable to open maps"));
  };

  const headingText = useMemo(() => {
    if (searchMode === "nearby" && selectedCity) {
      return `Nearby Graveyards in ${selectedCity}`;
    }
    if (searchMode === "nearby" && detectedPlace) {
      return `Nearby Graveyards in ${detectedPlace}`;
    }
    if (searchMode === "nearby") {
      return "Nearby Graveyards";
    }
    if (!selectedCity) return "Search Graveyards by City";
    return `Available Graveyards in ${selectedCity}`;
  }, [selectedCity, searchMode, detectedPlace]);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.container}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.replace("/")}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.heading}>{headingText}</Text>

        <View style={styles.pickerCard}>
          {loadingCities ? (
            <View style={styles.rowCenter}>
              <ActivityIndicator size="small" color={BROWN} />
              <Text style={styles.pickerLoadingText}>Loading cities...</Text>
            </View>
          ) : (
            <Picker selectedValue={selectedCity} onValueChange={onSelectCity}>
              <Picker.Item label="-- Select City --" value="" />
              {cities.map((c) => (
                <Picker.Item key={c} label={c} value={c} />
              ))}
            </Picker>
          )}
        </View>

        <View style={styles.nearbyWrap}>
          <TouchableOpacity style={styles.nearbyBtn} onPress={onSearchNearby}>
            <Text style={styles.nearbyBtnText}>Search Nearby</Text>
          </TouchableOpacity>
        </View>

        {loadingList ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={BROWN} />
            <Text style={styles.loadingText}>Fetching graveyards...</Text>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            {searchMode === null && !selectedCity ? (
              <Text style={styles.noResult}>Please select a city to see available graveyards.</Text>
            ) : graveyards.length === 0 && searchMode === "nearby" ? (
              <Text style={styles.noResult}>No nearby graveyards found for your current location.</Text>
            ) : graveyards.length === 0 ? (
              <Text style={styles.noResult}>No active graveyards found in {selectedCity}.</Text>
            ) : (
              graveyards.map((g) => {
                const coords = g.location?.coordinates;
                const lat = coords?.[1];
                const lng = coords?.[0];

                return (
                  <View key={g._id} style={styles.card}>
                    <Text style={styles.name}>{g.name}</Text>
                    <Text style={styles.address}>{g.address}</Text>

                    <Text style={styles.meta}>
                      City: <Text style={styles.metaStrong}>{g.city}</Text>
                    </Text>

                    {typeof lat === "number" && typeof lng === "number" ? (
                      <Text style={styles.meta}>
                        Location:{" "}
                        <Text style={styles.metaStrong}>
                          {lat.toFixed(6)}, {lng.toFixed(6)}
                        </Text>
                      </Text>
                    ) : (
                      <Text style={styles.meta}>Location: Not available</Text>
                    )}

                    <Text style={styles.meta}>
                      Contact: <Text style={styles.metaStrong}>{g.contactNumber || "Not available"}</Text>
                    </Text>

                    <View style={styles.actions}>
                      <TouchableOpacity style={styles.actionBtn} onPress={() => handleCall(g.contactNumber)}>
                        <Text style={styles.actionText}>Call</Text>
                      </TouchableOpacity>

                      <TouchableOpacity style={[styles.actionBtn, styles.actionBtnSecond]} onPress={() => handleOpenMap(g)}>
                        <Text style={styles.actionText}>Open Map</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })
            )}
          </ScrollView>
        )}
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  topBar: {
    paddingHorizontal: 15,
    paddingVertical: 12,
  },

  backText: {
    fontSize: 16,
    color: BROWN,
    fontWeight: "600",
  },

  heading: {
    fontSize: 18,
    fontWeight: "700",
    color: BROWN,
    marginHorizontal: 15,
    marginBottom: 10,
  },

  pickerCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: "#eee",
    overflow: "hidden",
  },

  rowCenter: { flexDirection: "row", alignItems: "center", padding: 12 },
  pickerLoadingText: { marginLeft: 10, color: "#666" },

  nearbyWrap: {
    marginHorizontal: 15,
    marginBottom: 6,
    alignItems: "flex-start",
  },

  nearbyBtn: {
    borderWidth: 1,
    borderColor: BROWN,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: "#fff",
  },

  nearbyBtnText: {
    color: BROWN,
    fontWeight: "600",
    fontSize: 13,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#666",
  },

  noResult: {
    textAlign: "center",
    marginTop: 30,
    color: "#777",
    marginHorizontal: 20,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 15,
    marginVertical: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },

  name: {
    fontSize: 15,
    fontWeight: "600",
    color: BROWN,
  },

  address: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },

  meta: {
    fontSize: 12,
    color: "#777",
    marginTop: 6,
  },

  metaStrong: {
    color: "#333",
    fontWeight: "600",
  },

  actions: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 12,
    gap: 10,
  },

  actionBtn: {
    borderWidth: 1,
    borderColor: BROWN,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 18,
  },

  actionBtnSecond: {
    // same style, just keeps spacing consistent
  },

  actionText: {
    fontSize: 12,
    color: BROWN,
    fontWeight: "600",
  },
});
