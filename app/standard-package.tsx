import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import TopBar from "../components/TopBar";
import BottomNavBar from "../components/BottomNavBar";
import { getPackages, Service } from "../utils/servicesAPI";

export default function StandardPackageScreen() {
  const router = useRouter();
  const [items, setItems] = useState<Service[]>([]);

  // Fetch Standard Package items from backend
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const packages = await getPackages();
        const standardPackage = packages.find((p) => p.type === "standard");
        if (standardPackage) setItems(standardPackage.items);
      } catch (err) {
        console.error("Error fetching standard package:", err);
      }
    };
    fetchItems();
  }, []);

  const handleBook = () => {
    router.push({
      pathname: "/order-details",
      params: {
        packageName: "Standard Package",
        items: JSON.stringify(items.map((item) => ({ name: item.name, price: item.price }))),
      },
    });
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.container}>
        <TopBar showBack title="Packages" onBackPress={() => router.back()} />

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Tabs */}
          <View style={styles.tabs}>
            <TouchableOpacity onPress={() => router.push("/basic-package")}>
              <Text style={styles.tab}>Basic</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={[styles.tab, styles.activeTab]}>Standard</Text>
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
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.packageTitle}>{item.name}</Text>
                <Text style={styles.packagePrice}>
                  Rs {item.price.toLocaleString()}
                </Text>
              </View>
              <Text style={styles.packageDesc}>{item.desc}</Text>
            </View>
          ))}
          {/* Total Amount */}
          <View style={styles.totalCard}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalPrice}>
              Rs{" "}
              {items
                .reduce((sum, item) => sum + item.price, 0)
                .toLocaleString()}
            </Text>
          </View>

          <TouchableOpacity style={styles.buyButton} onPress={handleBook}>
            <Text style={styles.buyButtonText}>Buy Now</Text>
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
  bullet: { fontSize: 18, color: BROWN, marginRight: 6, marginTop: -2 },
  packageTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: BROWN,
  },
  packagePrice: { fontSize: 16, fontWeight: "700", color: BROWN },
  packageDesc: { fontSize: 12, color: "#666", marginLeft: 20 },
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
