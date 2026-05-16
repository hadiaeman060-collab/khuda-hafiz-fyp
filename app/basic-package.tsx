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
import { getPackages, Service } from "../utils/servicesAPI";
import { palette, radius, shadow, spacing } from "../constants/theme";

export default function BasicPackageScreen() {
  const router = useRouter();
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

  const handleBook = () => {
    router.push({
      pathname: "/order-details",
      params: {
        packageName: "Basic Package",
        items: JSON.stringify(items.map((item) => ({ name: item.name, price: item.price }))),
      },
    });
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <TopBar showBack title="Packages" onBackPress={() => router.back()} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
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
const BROWN = palette.brown;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: palette.cream },
  scrollContent: { paddingBottom: 112 },

  tabs: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: spacing.md,
    padding: 5,
    borderRadius: radius.pill,
    backgroundColor: palette.white,
    borderWidth: 1,
    borderColor: palette.border,
    ...shadow.soft,
  },
  tab: {
    fontSize: 12,
    color: palette.muted,
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: radius.pill,
    fontWeight: "800",
  },
  activeTab: { backgroundColor: BROWN, color: "#fff", fontWeight: "900" },

  packageCard: {
    backgroundColor: palette.white,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginHorizontal: 15,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: palette.border,
    ...shadow.soft,
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
    fontWeight: "800",
    color: BROWN,
  },

  packagePrice: { fontSize: 16, fontWeight: "700", color: BROWN },
  packageDesc: { fontSize: 12, color: palette.muted, marginLeft: 0, lineHeight: 18 },

  totalCard: {
    backgroundColor: palette.parchment,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginHorizontal: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: palette.sand,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  totalLabel: { fontSize: 15, fontWeight: "800", color: BROWN },
  totalPrice: { fontSize: 17, fontWeight: "900", color: BROWN },

  buyButton: {
    backgroundColor: palette.mahogany,
    margin: 20,
    paddingVertical: 14,
    borderRadius: radius.pill,
    alignItems: "center",
    ...shadow.glow,
  },
  buyButtonText: { color: "#fff", fontSize: 16, fontWeight: "900" },
});
