import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import OSMAutocompleteInput from "../components/OSMAutocompleteInput";
import { bookPackage } from "../utils/servicesAPI";
import { useAuth } from "./context/AuthContext";
import { useNotifications } from "./context/NotificationContext";

export default function OrderDetailsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const { packageName, items, pickupLocation, deliveryAddress: deliveryAddressParam } =
    useLocalSearchParams<{
    packageName?: string;
    items?: string;
    pickupLocation?: string;
    deliveryAddress?: string;
  }>();

  const parsedItems = useMemo(() => {
    if (!items || typeof items !== "string") return [];
    try {
      return JSON.parse(items);
    } catch {
      return [];
    }
  }, [items]);

  const fixedDeliveryAddress = useMemo(() => {
    if (typeof deliveryAddressParam === "string" && deliveryAddressParam.trim()) {
      return deliveryAddressParam;
    }
    if (typeof pickupLocation === "string" && pickupLocation.trim()) {
      return pickupLocation;
    }
    return "";
  }, [deliveryAddressParam, pickupLocation]);

  const isFixedDeliveryAddress = Boolean(fixedDeliveryAddress);

  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"" | "online" | "cod">("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isFixedDeliveryAddress) {
      setDeliveryAddress(fixedDeliveryAddress);
    }
  }, [isFixedDeliveryAddress, fixedDeliveryAddress]);

  const total = parsedItems.reduce(
    (sum: number, item: any) => sum + (Number(item?.price) || 0),
    0
  );

  const formattedDate = useMemo(() => {
    try {
      return new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "";
    }
  }, []);

  const paymentLabel =
    paymentMethod === "online"
      ? "Online Payment"
      : paymentMethod === "cod"
      ? "Cash on Delivery"
      : "";

  const handleProceed = async () => {
    if (!user?.uid) {
      Alert.alert("Login Required", "Please log in to place your order.");
      router.push("/login");
      return;
    }

    if (parsedItems.length === 0) {
      Alert.alert("Order Error", "No order items found. Please place order again.");
      return;
    }

    if (!deliveryAddress.trim()) {
      Alert.alert("Address Required", "Please enter a delivery address.");
      return;
    }

    if (!paymentMethod) {
      Alert.alert("Payment Method", "Please select a payment method.");
      return;
    }

    try {
      setSubmitting(true);
      const response = await bookPackage({
        userId: user.uid,
        packageName: String(packageName || "Service Order"),
        items: parsedItems.map((item: any) => ({
          name: String(item?.name ?? "Item"),
          price: Number(item?.price) || 0,
        })),
        totalPrice: total,
        paymentMode: paymentMethod === "online" ? "online" : "cash_on_delivery",
      });

      if (!response.success) {
        Alert.alert("Booking Failed", response.error || "Could not place booking.");
        return;
      }

      addNotification({
        title: "Booking Confirmed",
        text: `${String(packageName || "Your package")} booking was placed successfully.`,
        type: "success",
      });

      router.push({
        pathname: "/order-confirmation",
        params: {
          deliveryAddress,
          paymentMethod: paymentLabel,
        },
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
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
            <Text style={styles.date}>{formattedDate}</Text>
          </View>

          <View style={styles.sectionRow}>
            <Image
              source={require("../assets/icons/location.png")}
              style={styles.sectionIcon}
            />
            <View>
              <Text style={styles.sectionTitle}>Delivery Address</Text>
              {isFixedDeliveryAddress ? (
                <Text style={styles.sectionText}>{deliveryAddress}</Text>
              ) : (
                <View style={styles.addressInputWrap}>
                  <OSMAutocompleteInput
                    placeholder="Enter delivery address"
                    value={deliveryAddress}
                    onChangeText={setDeliveryAddress}
                    onSelect={(item) => setDeliveryAddress(item.label)}
                  />
                </View>
              )}
            </View>
          </View>

          <View style={styles.sectionRow}>
            <Image
              source={require("../assets/icons/wallet.png")}
              style={styles.sectionIcon}
            />
            <View>
              <Text style={styles.sectionTitle}>Payment Method</Text>
              <View style={styles.paymentOptions}>
                <TouchableOpacity
                  style={[
                    styles.paymentChip,
                    paymentMethod === "online" && styles.paymentChipActive,
                  ]}
                  onPress={() => setPaymentMethod("online")}
                >
                  <Text
                    style={[
                      styles.paymentChipText,
                      paymentMethod === "online" && styles.paymentChipTextActive,
                    ]}
                  >
                    Online
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.paymentChip,
                    paymentMethod === "cod" && styles.paymentChipActive,
                  ]}
                  onPress={() => setPaymentMethod("cod")}
                >
                  <Text
                    style={[
                      styles.paymentChipText,
                      paymentMethod === "cod" && styles.paymentChipTextActive,
                    ]}
                  >
                    Cash on Delivery
                  </Text>
                </TouchableOpacity>
              </View>
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
        <TouchableOpacity
          style={[styles.payButton, submitting && styles.payButtonDisabled]}
          onPress={handleProceed}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.payButtonText}>Proceed to Payment</Text>
          )}
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
  addressInputWrap: {
    width: "100%",
    marginTop: 6,
  },
  paymentOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  paymentChip: {
    borderWidth: 1,
    borderColor: "#c8b8a7",
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    marginRight: 8,
    marginBottom: 8,
  },
  paymentChipActive: {
    borderColor: BROWN,
    backgroundColor: "#f1e5da",
  },
  paymentChipText: {
    fontSize: 12,
    color: "#5b5b5b",
    fontWeight: "600",
  },
  paymentChipTextActive: {
    color: BROWN,
  },
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
  payButtonDisabled: {
    opacity: 0.7,
  },
  payButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
