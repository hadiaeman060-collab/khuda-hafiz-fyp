import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import TopBar from "../components/TopBar";
import BottomNavBar from "../components/BottomNavBar";
import { getServices, bookPackage, Service } from "../utils/servicesAPI";
import { useAuth } from "./context/AuthContext";

export default function CustomizePackageScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [services, setServices] = useState<Service[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  // 🔹 Fetch services from MongoDB
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getServices();
        setServices(data);
      } catch (err) {
        console.error("Failed to fetch services", err);
      }
    };
    fetchServices();
  }, []);

  // 🔹 Select / unselect service
  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // 🔹 Selected items
  const selectedItems = services
    .filter((s) => selected.includes(s._id))
    .map((s) => ({
      name: s.name,
      price: s.price,
    }));

  // 🔹 Total price
  const total = selectedItems.reduce((sum, item) => sum + item.price, 0);

  // 🔹 Book package
  const handleBook = async () => {
    if (!user?.uid) {
      alert("Please log in to book a package");
      router.push("/login");
      return;
    }

    try {
      const bookingData = {
        userId: user.uid,
        packageName: "Custom Package",
        items: selectedItems,
        totalPrice: total,
      };

      const res = await bookPackage(bookingData);

      if (!res.error) {
        alert("Booking successful!");
        router.push({
          pathname: "/order-details",
          params: {
            packageName: "Custom Package",
            items: JSON.stringify(selectedItems),
          },
        });
      } else {
        alert("Booking failed");
      }
    } catch (err) {
      console.error("Booking error", err);
      alert("Something went wrong");
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.container}>
        <TopBar showBack onBackPress={() => router.back()} />

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Tabs */}
          <View style={styles.tabs}>
            <TouchableOpacity onPress={() => router.push("/basic-package")}>
              <Text style={styles.tab}>Basic</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/standard-package")}>
              <Text style={styles.tab}>Standard</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/premium-package")}>
              <Text style={styles.tab}>Premium</Text>
            </TouchableOpacity>

            <TouchableOpacity>
              <Text style={[styles.tab, styles.activeTab]}>Customize</Text>
            </TouchableOpacity>
          </View>

          {/* Services */}
          {services.map((item) => (
            <TouchableOpacity
              key={item._id}
              style={styles.packageCard}
              onPress={() => toggleSelect(item._id)}
            >
              <View style={styles.cardRow}>
                <View
                  style={[
                    styles.radio,
                    selected.includes(item._id) && styles.radioSelected,
                  ]}
                />
                <Text style={styles.packageTitle}>{item.name}</Text>
                <Text style={styles.packagePrice}>
                  Rs {item.price.toLocaleString()}
                </Text>
              </View>

              <Text style={styles.packageDesc}>{item.desc}</Text>
            </TouchableOpacity>
          ))}

          {/* Total */}
          <View style={styles.totalCard}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalPrice}>Rs {total.toLocaleString()}</Text>
          </View>

          {/* Book Button */}
          <TouchableOpacity
            style={[
              styles.buyButton,
              selected.length === 0 && { opacity: 0.5 },
            ]}
            disabled={selected.length === 0}
            onPress={handleBook}
          >
            <Text style={styles.buyButtonText}>Book Now</Text>
          </TouchableOpacity>
        </ScrollView>

        <BottomNavBar />
      </View>
    </>
  );
}

/* ===================== STYLES ===================== */

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

  activeTab: {
    backgroundColor: BROWN,
    color: "#fff",
    fontWeight: "600",
  },

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

  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: BROWN,
    marginRight: 10,
  },

  radioSelected: {
    backgroundColor: BROWN,
  },

  packageTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: BROWN,
  },

  packagePrice: {
    fontSize: 16,
    fontWeight: "700",
    color: BROWN,
  },

  packageDesc: {
    fontSize: 12,
    color: "#666",
    marginLeft: 28,
  },

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

  totalLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: BROWN,
  },

  totalPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: BROWN,
  },

  buyButton: {
    backgroundColor: BROWN,
    margin: 20,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  buyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
