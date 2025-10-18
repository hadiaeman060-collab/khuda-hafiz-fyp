import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Stack, useRouter } from "expo-router";

export default function CustomizePackageScreen() {
  const router = useRouter();

  // Available services
  const services = [
    { id: 1, name: "Flowers", desc: "Fresh Sympathy Flowers", price: 1000 },
    { id: 2, name: "Kafan", desc: "100% Pure White Cotton", price: 4000 },
    { id: 3, name: "Tombstone", desc: "Tombstone with Inscription", price: 10000 },
    { id: 4, name: "Grave", desc: "Grave Digging & Setup", price: 40000 },
    { id: 5, name: "Catering", desc: "Meals Arranged with Care", price: 120000 },
  ];

  // Track selected services
  const [selected, setSelected] = useState<number[]>([]);

  // Toggle service selection
  const toggleSelect = (id: number) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((item) => item !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  // Calculate total
  const total = services
    .filter((s) => selected.includes(s.id))
    .reduce((sum, s) => sum + s.price, 0);

  // Prepare selected items for order-details
  const selectedItems = services
    .filter((s) => selected.includes(s.id))
    .map((s) => ({ name: s.name, price: s.price }));

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Top Bar */}
          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => router.back()}>
              <Image
                source={require("../assets/icons/back.png")}
                style={styles.topIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image
                source={require("../assets/icons/bell.png")}
                style={styles.topIcon}
              />
            </TouchableOpacity>
          </View>

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
            <TouchableOpacity onPress={() => router.push("/customize-package")}>
              <Text style={[styles.tab, styles.activeTab]}>Customize</Text>
            </TouchableOpacity>
          </View>

          {/* Title */}
          <View style={{ paddingHorizontal: 20, marginVertical: 10 }}>
            <Text style={styles.title}>Make Your Own Package</Text>
            <Text style={styles.subtitle}>
              Build a personalized package with the services that matter most to you.
            </Text>
          </View>

          {/* Package Options */}
          {services.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.packageCard}
              onPress={() => toggleSelect(item.id)}
            >
              <View style={styles.cardRow}>
                {/* Radio Button */}
                <View
                  style={[
                    styles.radio,
                    selected.includes(item.id) && styles.radioSelected,
                  ]}
                />
                <Text style={styles.packageTitle}>{item.name}</Text>
                <Text style={styles.packagePrice}>
                  Rs. {item.price.toLocaleString()}
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

          {/* Buy Now Button */}
          <TouchableOpacity
            style={styles.buyButton}
            onPress={() =>
              router.push({
                pathname: "/order-details",
                params: {
                  packageName: "Custom Package",
                  items: JSON.stringify(selectedItems),
                },
              })
            }
          >
            <Text style={styles.buyButtonText}>Buy Now</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Bottom Navbar */}
        <View style={styles.navbar}>
          <NavItem
            label="Home"
            icon={require("../assets/icons/home.png")}
            onPress={() => router.push("/home")}
          />
          <NavItem
            label="Packages"
            icon={require("../assets/icons/packages.png")}
            active
            onPress={() => router.push("/basic-package")}
          />

          {/* Floating Call Button */}
          <TouchableOpacity style={styles.callButton}>
            <Image
              source={require("../assets/icons/call.png")}
              style={styles.callIcon}
            />
          </TouchableOpacity>

          <NavItem label="Contact" icon={require("../assets/icons/contact.png")} />
          <NavItem label="Message" icon={require("../assets/icons/message.png")} />
        </View>
      </View>
    </>
  );
}

//
// Reusable Nav Item
//
type NavItemProps = {
  label: string;
  icon: any;
  active?: boolean;
  onPress?: () => void;
};

const NavItem = ({ label, icon, active, onPress }: NavItemProps) => (
  <TouchableOpacity style={styles.navItem} onPress={onPress}>
    <Image source={icon} style={[styles.navIcon, active && styles.activeIcon]} />
    <Text style={[styles.navLabel, active && styles.activeLabel]}>{label}</Text>
  </TouchableOpacity>
);

//
// Styles
//
const BROWN = "#5a3d2b";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  topIcon: { width: 26, height: 26, tintColor: BROWN },
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
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: BROWN,
    marginBottom: 4,
    textAlign: "center",
  },
  subtitle: { fontSize: 13, color: "#666", textAlign: "center" },
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
  packageTitle: { flex: 1, fontSize: 14, fontWeight: "500", color: BROWN },
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
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },
  navItem: { alignItems: "center" },
  navIcon: { width: 22, height: 22, marginBottom: 2 },
  navLabel: { fontSize: 10 },
  activeIcon: { tintColor: BROWN },
  activeLabel: { color: BROWN, fontWeight: "600" },
  callButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginTop: -30,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  callIcon: { width: 28, height: 28, tintColor: BROWN },
});
