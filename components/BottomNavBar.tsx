import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router"; // ✅ Import useRouter

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

type BottomNavBarProps = {
  activeTab?: string;
  onHomePress?: () => void;
  onPackagesPress?: () => void;
  onContactPress?: () => void;
  onMessagePress?: () => void;
  onCallPress?: () => void;
};

export default function BottomNavBar({
  activeTab = "Home",
  onHomePress,
  onPackagesPress,
  onContactPress,
  onMessagePress,
  onCallPress,
}: BottomNavBarProps) {
  const router = useRouter(); // ✅ Initialize router

  return (
    <View style={styles.navbar}>
      {/* Home */}
      <NavItem
        label="Home"
        icon={require("../assets/icons/home.png")}
        active={activeTab === "Home"}
        onPress={onHomePress || (() => router.push("/home"))}
      />

      {/* Packages */}
      <NavItem
        label="Packages"
        icon={require("../assets/icons/packages.png")}
        active={activeTab === "Packages"}
        onPress={onPackagesPress || (() => router.push("/basic-package"))}
      />

      {/* Floating Call Button */}
      <TouchableOpacity style={styles.callButton} onPress={onCallPress}>
        <Image
          source={require("../assets/icons/call.png")}
          style={styles.callIcon}
        />
      </TouchableOpacity>

      {/* Contact */}
      <NavItem
        label="Contact"
        icon={require("../assets/icons/contact.png")}
        active={activeTab === "Contact"}
        onPress={onContactPress || (() => router.push("/contact"))}
      />

      {/* Message */}
      <NavItem
        label="Message"
        icon={require("../assets/icons/message.png")}
        active={activeTab === "Message"}
        onPress={onMessagePress || (() => router.push("/chatbot"))}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
    marginTop: -30,
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
