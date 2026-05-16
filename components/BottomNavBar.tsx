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
import { palette, radius, shadow, spacing } from "../constants/theme";

const { width, height } = Dimensions.get("window");
const EMERGENCY_NUMBER = "tel:+923057834162";

type NavItemProps = {
  label: string;
  icon: any;
  active?: boolean;
  onPress?: () => void;
};

const NavItem = ({ label, icon, active, onPress }: NavItemProps) => (
  <TouchableOpacity
    style={[styles.navItem, active && styles.navItemActive]}
    onPress={onPress}
  >
    <Image source={icon} style={[styles.navIcon, active && styles.activeIcon]} />
    <Text style={[styles.navLabel, active && styles.activeLabel]}>{label}</Text>
  </TouchableOpacity>
);

export default function BottomNavBar({ activeTab = "Home" }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scale = useRef(new Animated.Value(1)).current;
  const positionY = useRef(new Animated.Value(0)).current;

  const [isExpanded, setIsExpanded] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const animatePress = () => {
    const targetScale = isExpanded ? 1 : 3.2;
    const targetY = isExpanded ? 0 : -height * 0.38;

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
      {isExpanded && (
        <Pressable style={styles.blurOverlay} onPress={animatePress}>
          <BlurView intensity={42} tint="light" style={{ flex: 1 }} />
        </Pressable>
      )}

      <Animated.View
        style={[
          styles.floatingCallButton,
          {
            transform: [{ translateY: positionY }],
            bottom: insets.bottom + 18,
          },
        ]}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          <TouchableOpacity onPress={animatePress} activeOpacity={0.9}>
            <Image
              source={require("../assets/icons/call.png")}
              style={styles.floatingCallIcon}
            />
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>

      <Modal transparent visible={showConfirm} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <TouchableOpacity
              style={styles.closeIcon}
              onPress={() => setShowConfirm(false)}
            >
              <Text style={styles.closeIconText}>x</Text>
            </TouchableOpacity>

            <View style={styles.modalIconShell}>
              <Image
                source={require("../assets/icons/call.png")}
                style={styles.modalIcon}
              />
            </View>

            <Text style={styles.modalTitle}>Emergency Call</Text>
            <Text style={styles.modalText}>
              Do you want to call Khuda Hafiz emergency service?
            </Text>

            <TouchableOpacity style={styles.confirmButton} onPress={handleCall}>
              <Text style={styles.confirmText}>Call Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <SafeAreaView
        edges={["bottom", "left", "right"]}
        style={styles.safeArea}
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
          <View style={{ width: 62 }} />
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
  safeArea: {
    backgroundColor: "transparent",
  },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    paddingTop: 10,
    paddingHorizontal: spacing.xs,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radius.xl,
    backgroundColor: "rgba(255,255,255,0.96)",
    ...shadow.medium,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 58,
    minHeight: 50,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.xs,
  },
  navItemActive: {
    backgroundColor: palette.parchment,
  },
  navIcon: {
    width: 22,
    height: 22,
    marginBottom: 2,
    tintColor: palette.faint,
  },
  navLabel: {
    fontSize: 10,
    color: palette.faint,
    fontWeight: "700",
  },
  activeIcon: {
    tintColor: palette.brown,
  },
  activeLabel: {
    color: palette.brown,
    fontWeight: "800",
  },
  floatingCallButton: {
    position: "absolute",
    alignSelf: "center",
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: palette.mahogany,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 5,
    borderColor: palette.cream,
    ...shadow.glow,
    zIndex: 1000,
  },
  floatingCallIcon: {
    width: 34,
    height: 34,
    tintColor: palette.white,
  },
  blurOverlay: {
    position: "absolute",
    width,
    height,
    top: 0,
    left: 0,
    zIndex: 999,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(33,24,20,0.42)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: 286,
    backgroundColor: palette.white,
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: "center",
    borderWidth: 1,
    borderColor: palette.border,
    ...shadow.medium,
  },
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 12,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  closeIconText: {
    fontSize: 18,
    color: palette.muted,
    fontWeight: "800",
  },
  modalIconShell: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: palette.parchment,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  modalIcon: {
    width: 34,
    height: 34,
    tintColor: palette.brown,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: palette.ink,
    marginBottom: 6,
  },
  modalText: {
    fontSize: 13,
    color: palette.muted,
    textAlign: "center",
    marginBottom: 18,
    lineHeight: 19,
  },
  confirmButton: {
    backgroundColor: palette.mahogany,
    paddingVertical: 12,
    paddingHorizontal: 34,
    borderRadius: radius.pill,
  },
  confirmText: {
    color: palette.white,
    fontWeight: "800",
  },
});
