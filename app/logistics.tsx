import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Stack, useRouter } from "expo-router";

import TopBar from "../components/TopBar";
import BottomNavBar from "../components/BottomNavBar";
import FloatingCallButton from "../components/FloatingSearchGraveButton";
import OSMAutocompleteInput from "../components/OSMAutocompleteInput";

type LatLng = { lat: number; lng: number };

const RATE_PER_KM = 50;

export default function LogisticScreen() {
  const router = useRouter();

  const service = useMemo(
    () => ({
      name: "Booking & Logistics Coordination",
      desc: "Streamlined booking system for grave sites, transportation, funeral venues, and all essential services, ensuring timely, respectful arrangements without added stress.",
    }),
    []
  );

  const [pickupText, setPickupText] = useState("");
  const [dropText, setDropText] = useState("");

  const [pickupCoords, setPickupCoords] = useState<LatLng | null>(null);
  const [dropCoords, setDropCoords] = useState<LatLng | null>(null);

  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [price, setPrice] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const calcDistanceAndPrice = async (o: LatLng, d: LatLng) => {
    try {
      setLoading(true);
      setErr(null);
      setDistanceKm(null);
      setPrice(null);

      // OSRM public demo route API (driving distance)
      const url =
        `https://router.project-osrm.org/route/v1/driving/` +
        `${o.lng},${o.lat};${d.lng},${d.lat}` +
        `?overview=false`;

      const res = await fetch(url);
      const data = await res.json();

      const meters = data?.routes?.[0]?.distance;
      if (typeof meters !== "number") throw new Error("Unable to calculate route distance.");

      const km = meters / 1000;
      const kmRounded = Math.round(km * 100) / 100;
      const total = Math.round(km * RATE_PER_KM);

      setDistanceKm(kmRounded);
      setPrice(total);
    } catch (e: any) {
      setErr(e?.message ?? "Distance calculation failed.");
    } finally {
      setLoading(false);
    }
  };

  const onSelectPickup = async (p: { label: string; lat: number; lng: number }) => {
    setPickupText(p.label);
    const origin = { lat: p.lat, lng: p.lng };
    setPickupCoords(origin);

    if (dropCoords) await calcDistanceAndPrice(origin, dropCoords);
    else {
      setDistanceKm(null);
      setPrice(null);
      setErr(null);
    }
  };

  const onSelectDrop = async (p: { label: string; lat: number; lng: number }) => {
    setDropText(p.label);
    const dest = { lat: p.lat, lng: p.lng };
    setDropCoords(dest);

    if (pickupCoords) await calcDistanceAndPrice(pickupCoords, dest);
    else {
      setDistanceKm(null);
      setPrice(null);
      setErr(null);
    }
  };

  const canOrder = Boolean(pickupCoords && dropCoords && distanceKm != null && price != null && !loading);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.container}>
        <TopBar showBack title="Logistics & Booking" onBackPress={() => router.back()} />

        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <Image
            source={require("../assets/images/logistics-image.png")}
            style={styles.mainImage}
            resizeMode="contain"
          />

          <Text style={styles.title}>{service.name}</Text>
          <Text style={styles.desc}>{service.desc}</Text>

          <View style={styles.option}>
            <Image source={require("../assets/icons/logistics-icon1.png")} style={styles.optionIcon} />
            <Text style={styles.optionText}>Funeral Van Booking</Text>
          </View>

          <View style={styles.option}>
            <Image source={require("../assets/icons/logistics-icon2.png")} style={styles.optionIcon} />
            <Text style={styles.optionText}>Ghusl Facility Booking</Text>
          </View>

          <View style={styles.option}>
            <Image source={require("../assets/icons/logistics-icon3.png")} style={styles.optionIcon} />
            <Text style={styles.optionText}>Cemetery Coordination - Out of City</Text>
          </View>

          {/* Pickup */}
          <View style={[styles.locationBlock, styles.pickupLocationBlock]}>
            <Text style={styles.sectionLabel}>Pickup Location</Text>
            <OSMAutocompleteInput
              placeholder="Enter pickup location"
              value={pickupText}
              onChangeText={(t) => {
                setPickupText(t);
                setPickupCoords(null);
                setDistanceKm(null);
                setPrice(null);
                setErr(null);
              }}
              onSelect={onSelectPickup}
            />
          </View>

          {/* Drop */}
          <View style={[styles.locationBlock, styles.dropLocationBlock]}>
            <Text style={styles.sectionLabel}>Drop Location</Text>
            <OSMAutocompleteInput
              placeholder="Enter drop location"
              value={dropText}
              onChangeText={(t) => {
                setDropText(t);
                setDropCoords(null);
                setDistanceKm(null);
                setPrice(null);
                setErr(null);
              }}
              onSelect={onSelectDrop}
            />
          </View>

          {/* Summary */}
          <View style={styles.summaryCard}>
            <Text style={styles.rateText}>Rate: {RATE_PER_KM} PKR per kilometer</Text>

            {loading ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator />
                <Text style={styles.loadingText}>Calculating distance & price…</Text>
              </View>
            ) : err ? (
              <Text style={styles.errorText}>{err}</Text>
            ) : distanceKm != null && price != null ? (
              <>
                <Text style={styles.summaryText}>Distance: {distanceKm} km</Text>
                <Text style={styles.summaryPrice}>Estimated Price: PKR {price}</Text>
              </>
            ) : (
              <Text style={styles.hintText}>Select both pickup & drop to calculate distance and price.</Text>
            )}
          </View>

          {/* Order Now */}
          <TouchableOpacity
            style={[styles.orderButton, !canOrder && styles.orderButtonDisabled]}
            disabled={!canOrder}
            onPress={() =>
              router.push({
                pathname: "/order-details",
                params: {
                  packageName: service.name,
                  pickupLocation: pickupText,
                  dropLocation: dropText,
                  distanceKm: String(distanceKm ?? ""),
                  ratePerKm: String(RATE_PER_KM),
                  totalPrice: String(price ?? ""),
                  items: JSON.stringify([
                    {
                      name: `${service.name} (Ambulance)`,
                      price: price ?? 0,
                    },
                  ]),
                },
              })
            }
          >
            <Text style={styles.orderText}>Order Now</Text>
          </TouchableOpacity>

          <View style={{ height: 70 }} />
        </ScrollView>

        <FloatingCallButton />
        <BottomNavBar activeTab="Packages" />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff8ef" },
  mainImage: { width: "100%", height: 260, marginBottom: 20 },
  title: { fontSize: 18, fontWeight: "bold", marginHorizontal: 15, marginBottom: 10, color: "#000" },
  desc: { fontSize: 14, color: "#444", marginHorizontal: 15, marginBottom: 20, lineHeight: 20 },

  option: { flexDirection: "row", alignItems: "center", marginHorizontal: 15, marginBottom: 15 },
  optionIcon: { width: 28, height: 28, marginRight: 12, tintColor: "#8B4513" },
  optionText: { fontSize: 14, color: "#333" },

  locationBlock: { marginHorizontal: 15, marginTop: 14 },
  pickupLocationBlock: { zIndex: 30 },
  dropLocationBlock: { zIndex: 20 },
  sectionLabel: { fontSize: 13, fontWeight: "600", color: "#222", marginBottom: 8 },

  summaryCard: {
    marginHorizontal: 15,
    marginTop: 16,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fafafa",
  },
  rateText: { fontSize: 13, color: "#333", marginBottom: 8, fontWeight: "600" },
  hintText: { fontSize: 13, color: "#666" },
  summaryText: { fontSize: 14, color: "#222", marginTop: 4 },
  summaryPrice: { fontSize: 16, color: "#000", marginTop: 6, fontWeight: "700" },
  loadingRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  loadingText: { fontSize: 13, color: "#555" },
  errorText: { fontSize: 13, color: "#b00020" },

  orderButton: {
    alignSelf: "center",
    backgroundColor: "#5a3d2b",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 22,
    elevation: 3,
    marginBottom: 10,
  },
  orderButtonDisabled: { opacity: 0.5 },
  orderText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
