import React from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  useWindowDimensions,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "../app/context/AuthContext";
import { MaterialIcons, Ionicons, FontAwesome5 } from "@expo/vector-icons";

type Props = {
  visible: boolean;
  onClose: () => void;
};

const MenuItem = ({
  icon,
  label,
  onPress,
  labelStyle,
}: {
  icon: React.ReactNode;
  label: string;
  onPress?: () => void;
  labelStyle?: object;
}) => (
  <>
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.menuItem,
        pressed && styles.menuItemActive,
      ]}
    >
      <View style={styles.menuIcon}>{icon}</View>
      <Text style={[styles.menuLabel, labelStyle]}>{label}</Text>
    </Pressable>
    <View style={styles.itemSeparator} />
  </>
);

export default function MenuModal({ visible, onClose }: Props) {
  const router = useRouter();
  const auth = useAuth();
  const { width: windowWidth } = useWindowDimensions();
  const menuWidth = Math.min(320, Math.floor(windowWidth * 0.85));

  const translateX = useRef(new Animated.Value(-menuWidth)).current;
  const [localVisible, setLocalVisible] = useState(visible);

  // When `visible` becomes true, mount modal and animate in
  useEffect(() => {
    if (visible) {
      setLocalVisible(true);
      translateX.setValue(-menuWidth);
      Animated.timing(translateX, {
        toValue: 0,
        duration: 250,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    } else if (localVisible) {
      // animate out then unmount
      Animated.timing(translateX, {
        toValue: -menuWidth,
        duration: 200,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start(() => setLocalVisible(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, menuWidth]);

  const handleCloseFromOverlay = () => {
    // animate out then call onClose so parent can set visible=false
    Animated.timing(translateX, {
      toValue: -menuWidth,
      duration: 200,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setLocalVisible(false);
      onClose();
    });
  };

  if (!localVisible) return null;

  return (
    <Modal transparent visible={true} onRequestClose={handleCloseFromOverlay}>
      <Pressable style={styles.modalOverlay} onPress={handleCloseFromOverlay}>
        <View />
      </Pressable>

      <Animated.View
        style={[
          styles.modalContainer,
          { width: menuWidth, transform: [{ translateX: translateX }] },
        ]}
      >
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={40} color="#8b6f47" />
          </View>
          <Text style={styles.profileName}>
            {auth.user?.displayName || "Guest User"}
          </Text>
          <Text style={styles.profileEmail}>{auth.user?.email || ""}</Text>
        </View>

        <View style={styles.separator} />

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        >
          <MenuItem
            icon={<Ionicons name="person-outline" size={20} color="#3c1a06" />}
            label="My Profile"
            onPress={() => {
              handleCloseFromOverlay();
              router.push("/profile" as any);
            }}
          />

          <MenuItem
            icon={
              <Ionicons
                name="notifications-outline"
                size={20}
                color="#3c1a06"
              />
            }
            label="Notifications"
            onPress={() => {
              handleCloseFromOverlay();
              router.push("/notifications" as any);
            }}
          />

          <MenuItem
            icon={
              <Ionicons
                name="information-circle-outline"
                size={20}
                color="#3c1a06"
              />
            }
            label="About us"
            onPress={() => {
              handleCloseFromOverlay();
              router.push("/about" as any);
            }}
          />

          <MenuItem
            icon={<FontAwesome5 name="wallet" size={18} color="#3c1a06" />}
            label="Wallet"
            onPress={() => {
              handleCloseFromOverlay();
              router.push("/wallet" as any);
            }}
          />

          <MenuItem
            icon={
              <Ionicons name="settings-outline" size={20} color="#3c1a06" />
            }
            label="Settings"
            onPress={() => {
              handleCloseFromOverlay();
              router.push("/settings" as any);
            }}
          />

          <MenuItem
            icon={
              <Ionicons name="help-circle-outline" size={20} color="#3c1a06" />
            }
            label="Help"
            onPress={() => {
              handleCloseFromOverlay();
              router.push("/help" as any);
            }}
          />

          <MenuItem
            icon={<Ionicons name="call-outline" size={20} color="#3c1a06" />}
            label="Toll Free Number"
            onPress={() => {
              handleCloseFromOverlay();
              router.push("/toll-free-number" as any);
            }}
          />

          <MenuItem
            icon={
              <Ionicons name="lock-closed-outline" size={20} color="#3c1a06" />
            }
            label="Privacy Policy"
            onPress={() => {
              handleCloseFromOverlay();
              router.push("/privacy" as any);
            }}
          />

          <MenuItem
            icon={
              <MaterialIcons name="description" size={20} color="#3c1a06" />
            }
            label="Terms & Conditions"
            onPress={() => {
              handleCloseFromOverlay();
              router.push("/terms" as any);
            }}
          />

          <View style={styles.separatorSmall} />
          <MenuItem
            icon={<Ionicons name="log-out-outline" size={20} color="#d9534f" />}
            label="Log Out"
            labelStyle={{ color: "#d9534f" }}
            onPress={async () => {
              // close the menu first
              handleCloseFromOverlay();
              try {
                await auth.signOut();
              } catch (e) {
                console.warn("Logout from menu failed", e);
              } finally {
                // ensure user is redirected to login screen
                router.replace("/login");
              }
            }}
          />
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  modalContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: 320,
    backgroundColor: "#fff",
    padding: 16,
    // increase top padding so modal content sits a bit lower from the screen top
    paddingTop: 50,
  },
  profileCard: { alignItems: "center", marginBottom: 8, paddingVertical: 12 },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#f5ede4",
    borderWidth: 2,
    borderColor: "#3c1a06",
    alignItems: "center",
    justifyContent: "center",
  },
  profileName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
    marginTop: 10,
  },
  profileEmail: { fontSize: 13, color: "#777", marginTop: 4 },
  separator: { height: 1, backgroundColor: "#EEE", marginVertical: 10 },
  separatorSmall: { height: 8 },
  menuItemActive: { backgroundColor: "#f3e7dc", borderRadius: 8 },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  menuIcon: { width: 32, alignItems: "center", justifyContent: "center" },
  menuLabel: {
    fontSize: 14,
    color: "#3c1a06",
    marginLeft: 6,
    fontWeight: "600",
  },
  itemSeparator: {
    height: 1,
    backgroundColor: "#EEE",
    marginVertical: 8,
    marginLeft: 40,
    marginRight: 8,
  },
});
