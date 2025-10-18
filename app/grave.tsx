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

export default function GraveScreen() {
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

          {/* Grave Image */}
          <Image
            source={require("../assets/images/grave-detail.png")}
            style={styles.mainImage}
            resizeMode="contain"
          />

          {/* Grave Details */}
          <Text style={styles.title}>Grave</Text>
          <Text style={styles.desc}>
            We assist in grave selection, purchasing, and digging to ensure a
            smooth burial process. Our service includes reserved plots and
            immediate arrangements.
          </Text>

          {/* Grave Options */}
          <View style={styles.option}>
            <Image
              source={require("../assets/icons/earthen.png")}
              style={styles.optionIcon}
            />
            <Text style={styles.optionText}>Earthen, according to Sunnah</Text>
          </View>

          <View style={styles.option}>
            <Image
              source={require("../assets/icons/islamic-grave.png")}
              style={styles.optionIcon}
            />
            <Text style={styles.optionText}>Standard Islamic Grave</Text>
          </View>

          <View style={styles.option}>
            <Image
              source={require("../assets/icons/planks.png")}
              style={styles.optionIcon}
            />
            <Text style={styles.optionText}>Grave digging and Planks</Text>
          </View>
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={styles.navbar}>
          <NavItem label="Home" icon={require("../assets/icons/home.png")} active />
          <NavItem label="Packages" icon={require("../assets/icons/packages.png")} />

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
// Reusable Navbar Item
//
type NavItemProps = {
  label: string;
  icon: any;
  active?: boolean;
};

const NavItem = ({ label, icon, active }: NavItemProps) => (
  <TouchableOpacity style={styles.navItem}>
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
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  topIcon: {
    width: 26,
    height: 26,
    tintColor: "#5a3d2b",
  },
  mainImage: {
    width: "100%",
    height: 260, // Increased height
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 15,
    marginBottom: 10,
    color: "#000",
  },
  desc: {
    fontSize: 14,
    color: "#444",
    marginHorizontal: 15,
    marginBottom: 20,
    lineHeight: 20,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 15,
    marginBottom: 15,
  },
  optionIcon: {
    width: 28, // Increased size
    height: 28,
    marginRight: 12,
    tintColor: "#8B4513",
  },
  optionText: {
    fontSize: 14,
    color: "#333",
  },

  // Navbar
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },
  navItem: {
    alignItems: "center",
  },
  navIcon: {
    width: 22,
    height: 22,
    marginBottom: 2,
  },
  navLabel: {
    fontSize: 10,
  },
  activeIcon: {
    tintColor: "#8B4513",
  },
  activeLabel: {
    color: "#8B4513",
    fontWeight: "600",
  },
  callButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginTop: -30, // floats above navbar
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  callIcon: {
    width: 28,
    height: 28,
    tintColor: "#8B4513",
  },
});

