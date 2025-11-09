import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";

export default function OrderDetailsScreen() {
  const router = useRouter();
  const { packageName, items } = useLocalSearchParams();

  // Parse package items
  const parsedItems =
    items && typeof items === "string" ? JSON.parse(items) : [];

  const total = parsedItems.reduce((sum: number, item: any) => sum + item.price, 0);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()}>
            <Image
              source={require("../assets/icons/back.png")}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>

        {/* Title */}
        <Text style={styles.header}>Order Details</Text>

        {/* Order Info */}
        <View style={styles.infoCard}>
          <View style={styles.rowBetween}>
            <Text style={styles.orderId}>#234534</Text>
            <Text style={styles.date}>29 July 2025</Text>
          </View>

          <View style={styles.sectionRow}>
            <Image
              source={require("../assets/icons/location.png")}
              style={styles.sectionIcon}
            />
            <View>
              <Text style={styles.sectionTitle}>Delivery Address</Text>
              <Text style={styles.sectionText}>
                House 11 Street 32, Sector i8 Islamabad
              </Text>
            </View>
          </View>

          <View style={styles.sectionRow}>
            <Image
              source={require("../assets/icons/wallet.png")}
              style={styles.sectionIcon}
            />
            <View>
              <Text style={styles.sectionTitle}>Payment Method</Text>
              <Text style={styles.sectionText}>Online eWallet</Text>
            </View>
          </View>
        </View>

        {/* Package Details */}
        <Text style={styles.packageHeader}>{packageName}</Text>

        <View style={styles.packageCard}>
          {parsedItems.map((item: any, index: number) => (
            <View key={index} style={styles.packageRow}>
              <Image
                source={require("../assets/icons/check.png")}
                style={styles.checkIcon}
              />
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>Rs. {item.price.toLocaleString()}</Text>
            </View>
          ))}

          <View style={styles.divider} />

          <View style={styles.packageRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalPrice}>Rs {total.toLocaleString()}</Text>
          </View>
        </View>

        {/* Proceed to Payment */}
        <TouchableOpacity style={styles.payButton}
        onPress={() => router.push("/order-confirmation")}
>
          <Text style={styles.payButtonText}>Proceed to Payment</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}

//
// Styles
//
const BROWN = "#5a3d2b";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  topBar: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  icon: { width: 24, height: 24, tintColor: BROWN },
  header: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    color: BROWN,
    marginBottom: 20,
  },
  infoCard: {
    backgroundColor: "#f9f6f2",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  rowBetween: { flexDirection: "row", justifyContent: "space-between" },
  orderId: { fontSize: 14, fontWeight: "600", color: "#333" },
  date: { fontSize: 13, color: "#666" },
  sectionRow: { flexDirection: "row", alignItems: "flex-start", marginTop: 12 },
  sectionIcon: { width: 22, height: 22, tintColor: BROWN, marginRight: 10 },
  sectionTitle: { fontSize: 14, fontWeight: "600", color: "#000" },
  sectionText: { fontSize: 13, color: "#444" },
  packageHeader: {
    fontSize: 16,
    fontWeight: "700",
    color: BROWN,
    marginBottom: 10,
  },
  packageCard: {
    backgroundColor: "#f9f6f2",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  packageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  checkIcon: { width: 16, height: 16, tintColor: BROWN, marginRight: 8 },
  itemName: { flex: 1, fontSize: 14, color: "#000" },
  itemPrice: { fontSize: 14, fontWeight: "600", color: "#000" },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 8,
  },
  totalLabel: { fontSize: 15, fontWeight: "700", color: BROWN },
  totalPrice: { fontSize: 15, fontWeight: "700", color: BROWN },
  payButton: {
    backgroundColor: BROWN,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  payButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
