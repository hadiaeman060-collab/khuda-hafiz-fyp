import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import TopBar from "../components/TopBar";
import BottomNavBar from "../components/BottomNavBar";
import { getPackages, bookPackage, Service } from "../utils/servicesAPI";
import { useAuth } from "./context/AuthContext";

export default function BasicPackageScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [items, setItems] = useState<Service[]>([]);

  // Fetch Basic Package items from backend
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const packages = await getPackages();
        const basicPackage = packages.find((p) => p.type === "basic");
        if (basicPackage) setItems(basicPackage.items);
      } catch (err) {
        console.error("Error fetching basic package:", err);
      }
    };
    fetchItems();
  }, []);

  const handleBook = async () => {
    if (!user?.uid) {
      alert("Please log in to book a package");
      router.push("/login");
      return;
    }

    const bookingData = {
      userId: user.uid,
      packageName: "Basic Package",
      items: items.map((item) => ({ name: item.name, price: item.price })),
      totalPrice: items.reduce((sum, item) => sum + item.price, 0),
    };

    const res = await bookPackage(bookingData);
    if (res.success) {
      alert("Booking successful!");
      router.push({
        pathname: "/order-details",
        params: {
          packageName: "Basic Package",
          items: JSON.stringify(bookingData.items),
        },
      });
    } else {
      alert("Booking failed: " + res.error);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <TopBar showBack title="Packages" onBackPress={() => router.back()} />

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Tabs */}
          <View style={styles.tabs}>
            <TouchableOpacity>
              <Text style={[styles.tab, styles.activeTab]}>Basic</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/standard-package")}>
              <Text style={styles.tab}>Standard</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/premium-package")}>
              <Text style={styles.tab}>Premium</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/customize-package")}>
              <Text style={styles.tab}>Customize</Text>
            </TouchableOpacity>
          </View>

          {/* Package Items */}
          {items.map((item) => (
            <View key={item._id} style={styles.packageCard}>
              <View style={styles.cardRow}>
                <Text style={styles.packageTitle}>{item.name}</Text>
                <Text style={styles.packagePrice}>
                  Rs {item.price.toLocaleString()}
                </Text>
              </View>
              <Text style={styles.packageDesc}>{item.desc}</Text>
            </View>
          ))}

          {/* Total */}
          <View style={styles.totalCard}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalPrice}>
              Rs {items.reduce((sum, i) => sum + i.price, 0).toLocaleString()}
            </Text>
          </View>

          {/* Book Button */}
          <TouchableOpacity style={styles.buyButton} onPress={handleBook}>
            <Text style={styles.buyButtonText}>Book Now</Text>
          </TouchableOpacity>
        </ScrollView>

        <BottomNavBar activeTab="Packages" />
      </View>
    </>
  );
}
const BROWN = "#5a3d2b";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  tab: {
    fontSize: 14,
    color: "#777",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: "#f4f4f4",
  },
  activeTab: { backgroundColor: BROWN, color: "#fff", fontWeight: "600" },

  packageCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 15,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },

  cardRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: BROWN,
    marginRight: 10,
  },
  radioSelected: { backgroundColor: BROWN },

  packageTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: BROWN,
  },

  packagePrice: { fontSize: 16, fontWeight: "700", color: BROWN },
  packageDesc: { fontSize: 12, color: "#666", marginLeft: 28 },

  totalCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  totalLabel: { fontSize: 15, fontWeight: "600", color: BROWN },
  totalPrice: { fontSize: 16, fontWeight: "700", color: BROWN },

  buyButton: {
    backgroundColor: BROWN,
    margin: 20,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buyButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
