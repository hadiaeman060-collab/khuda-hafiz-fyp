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
  Modal,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

// 🔴 REAL EMERGENCY NUMBER (can be team member for now)
const EMERGENCY_NUMBER = "tel:+923057834162";

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
    <Text style={[styles.navLabel, active && styles.activeLabel]}>
      {label}
    </Text>
  </TouchableOpacity>
);

export default function BottomNavBar({ activeTab = "Home" }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Animations
  const scale = useRef(new Animated.Value(1)).current;
  const positionY = useRef(new Animated.Value(0)).current;

  const [isExpanded, setIsExpanded] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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

    if (!isExpanded) {
      setTimeout(() => setShowConfirm(true), 300);
    }

    setIsExpanded(!isExpanded);
  };

  const handleCall = () => {
    setShowConfirm(false);
    Linking.openURL(EMERGENCY_NUMBER);
  };

  return (
    <>
      {/* Blur Background */}
      {isExpanded && (
        <Pressable style={styles.blurOverlay} onPress={animatePress}>
          <BlurView intensity={40} style={{ flex: 1 }} />
        </Pressable>
      )}

      {/* Floating Call Button */}
      <Animated.View
        style={[
          styles.floatingCallButton,
          {
            transform: [{ scale }, { translateY: positionY }],
            bottom: insets.bottom + 16,
          },
        ]}
      >
        <TouchableOpacity onPress={animatePress} activeOpacity={0.9}>
          <Image
            source={require("../assets/icons/call.png")}
            style={styles.floatingCallIcon}
          />
        </TouchableOpacity>
      </Animated.View>

      {/* ✅ Confirmation Modal */}
      <Modal transparent visible={showConfirm} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <TouchableOpacity
              style={styles.closeIcon}
              onPress={() => setShowConfirm(false)}
            >
              <Text style={{ fontSize: 18 }}>✕</Text>
            </TouchableOpacity>

            <Image
              source={require("../assets/icons/call.png")}
              style={styles.modalIcon}
            />

            <Text style={styles.modalTitle}>
              Emergency Call
            </Text>
            <Text style={styles.modalText}>
              Do you want to call Khuda Hafiz emergency service?
            </Text>

            <TouchableOpacity style={styles.confirmButton} onPress={handleCall}>
              <Text style={styles.confirmText}>Call Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Bottom Navbar */}
      <SafeAreaView
        edges={["bottom", "left", "right"]}
        style={{ backgroundColor: "#fff" }}
      >
        <View
          style={[
            styles.navbar,
            { paddingBottom: Math.max(10, insets.bottom) },
          ]}
        >
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
            label="Feedback"
            icon={require("../assets/icons/message.png")}
            active={activeTab === "Feedback"}
            onPress={() => router.push("/feedback")}
          />
        </View>
      </SafeAreaView>
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

  blurOverlay: {
    position: "absolute",
    width,
    height,
    top: 0,
    left: 0,
    zIndex: 999,
  },

  /* 🔔 Modal Styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: 260,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 12,
  },
  modalIcon: {
    width: 40,
    height: 40,
    tintColor: "#5a3d2b",
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },
  modalText: {
    fontSize: 13,
    color: "#555",
    textAlign: "center",
    marginBottom: 16,
  },
  confirmButton: {
    backgroundColor: "#5a3d2b",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  confirmText: {
    color: "#fff",
    fontWeight: "600",
  },
});
