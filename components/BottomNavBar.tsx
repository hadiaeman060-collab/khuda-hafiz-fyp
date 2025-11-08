import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Animated,
  Dimensions,
  Pressable,
} from "react-native";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

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

export default function BottomNavBar({ activeTab = "Home" }) {
  const router = useRouter();

  // ✅ Animations
  const scale = useRef(new Animated.Value(1)).current;
  const positionY = useRef(new Animated.Value(0)).current;
  const [isExpanded, setIsExpanded] = useState(false);

  const animatePress = () => {
    const targetScale = isExpanded ? 1 : 3.2;
    const targetY = isExpanded ? 0 : -height * 0.25;

    Animated.parallel([
      Animated.spring(scale, {
        toValue: targetScale,
        friction: 8,
        tension: 120,
        useNativeDriver: true,
      }),
      Animated.spring(positionY, {
        toValue: targetY,
        friction: 8,
        tension: 120,
        useNativeDriver: true,
      }),
    ]).start();

    // ✅ Call automatically only when expanding
    if (!isExpanded) {
      setTimeout(() => {
        Linking.openURL("tel:0800786786");
      }, 300);
    }

    setIsExpanded(!isExpanded);
  };

  return (
    <>
      {/* ✅ Blur Background */}
      {isExpanded && (
        <Pressable style={styles.blurOverlay} onPress={animatePress}>
          <BlurView intensity={40} style={{ flex: 1 }} />
        </Pressable>
      )}

      {/* ✅ Floating Animated Call Button */}
      <Animated.View
        style={[
          styles.floatingCallButton,
          { transform: [{ scale }, { translateY: positionY }] },
        ]}
      >
        <TouchableOpacity onPress={animatePress} activeOpacity={0.9}>
          <Image
            source={require("../assets/icons/call.png")}
            style={styles.floatingCallIcon}
          />
        </TouchableOpacity>
      </Animated.View>

      {/* ✅ Bottom Navbar */}
      <View style={styles.navbar}>
        <NavItem
          label="Home"
          icon={require("../assets/icons/home.png")}
          active={activeTab === "Home"}
          onPress={() => router.push("/home")}
        />

        <NavItem
          label="Packages"
          icon={require("../assets/icons/packages.png")}
          active={activeTab === "Packages"}
          onPress={() => router.push("/basic-package")}
        />

        <View style={{ width: 60 }} />

        <NavItem
          label="Contact"
          icon={require("../assets/icons/contact.png")}
          active={activeTab === "Contact"}
          onPress={() => router.push("/contact")}
        />

        <NavItem
          label="Message"
          icon={require("../assets/icons/message.png")}
          active={activeTab === "Message"}
          onPress={() => router.push("/chatbot")}
        />
      </View>
    </>
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
    tintColor: "#5a3d2b",
  },
  activeLabel: {
    color: "#5a3d2b",
    fontWeight: "600",
  },

  // ✅ Floating Call Button (Original Placement)
  floatingCallButton: {
    position: "absolute",
    bottom: 35,
    alignSelf: "center",
    width: 75,
    height: 75,
    borderRadius: 90,
    backgroundColor: "#5a3d2b",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    zIndex: 1000,
  },
  floatingCallIcon: {
    width: 34,
    height: 34,
    tintColor: "#fff",
  },

  // ✅ Blur Overlay
  blurOverlay: {
    position: "absolute",
    width,
    height,
    top: 0,
    left: 0,
    zIndex: 999,
  },
});
