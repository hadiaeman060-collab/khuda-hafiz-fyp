import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Stack, useRouter } from "expo-router";

export default function BasicPackageScreen() {
  const router = useRouter();

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
            <TouchableOpacity
              onPress={() => router.push("/basic-package")}
            >
              <Text style={[styles.tab, styles.activeTab]}>Basic</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/standard-package")}
            >
              <Text style={styles.tab}>Standard</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/premium-package")}
            >
              <Text style={styles.tab}>Premium</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/customize-package")}
            >
              <Text style={styles.tab}>Customize</Text>
            </TouchableOpacity>
          </View>

          {/* Package Items */}
          <View style={styles.packageCard}>
            <View style={styles.cardRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.packageTitle}>Flowers</Text>
              <Text style={styles.packagePrice}>Rs. 1000</Text>
            </View>
            <Text style={styles.packageDesc}>Fresh Sympathy Flowers</Text>
          </View>

          <View style={styles.packageCard}>
            <View style={styles.cardRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.packageTitle}>Kafan</Text>
              <Text style={styles.packagePrice}>Rs. 4000</Text>
            </View>
            <Text style={styles.packageDesc}>100% Pure White Cotton</Text>
          </View>

          <View style={styles.packageCard}>
            <View style={styles.cardRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.packageTitle}>Catering</Text>
              <Text style={styles.packagePrice}>Rs. 120,000</Text>
            </View>
            <Text style={styles.packageDesc}>Meals Arranged with Care</Text>
          </View>

          {/* Buy Now Button */}
          <TouchableOpacity
  style={styles.buyButton}
  onPress={() =>
    router.push({
      pathname: "/order-details",
      params: {
        packageName: "Basic Package",
        items: JSON.stringify([
          { name: "Flowers", price: 1000 },
          { name: "Kafan", price: 4000 },
          { name: "Catering", price: 120000 },
        ]),
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

          <NavItem
            label="Contact"
            icon={require("../assets/icons/contact.png")}
          />
          <NavItem
            label="Message"
            icon={require("../assets/icons/message.png")}
          />
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
    <Image
      source={icon}
      style={[styles.navIcon, active && styles.activeIcon]}
    />
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
