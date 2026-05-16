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
import { palette, radius, shadow, spacing } from "../constants/theme";

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
            <Ionicons name="person" size={40} color={palette.bronze} />
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
            icon={<Ionicons name="person-outline" size={20} color={palette.mahogany} />}
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
                color={palette.mahogany}
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
                color={palette.mahogany}
              />
            }
            label="About us"
            onPress={() => {
              handleCloseFromOverlay();
              router.push("/about" as any);
            }}
          />

          <MenuItem
            icon={<FontAwesome5 name="wallet" size={18} color={palette.mahogany} />}
            label="Wallet"
            onPress={() => {
              handleCloseFromOverlay();
              router.push("/wallet" as any);
            }}
          />

          <MenuItem
            icon={
              <Ionicons name="settings-outline" size={20} color={palette.mahogany} />
            }
            label="Settings"
            onPress={() => {
              handleCloseFromOverlay();
              router.push("/settings" as any);
            }}
          />

          <MenuItem
            icon={
              <Ionicons name="help-circle-outline" size={20} color={palette.mahogany} />
            }
            label="Help"
            onPress={() => {
              handleCloseFromOverlay();
              router.push("/help" as any);
            }}
          />

          <MenuItem
            icon={<Ionicons name="call-outline" size={20} color={palette.mahogany} />}
            label="Toll Free Number"
            onPress={() => {
              handleCloseFromOverlay();
              router.push("/toll-free-number" as any);
            }}
          />

          <MenuItem
            icon={
              <Ionicons name="lock-closed-outline" size={20} color={palette.mahogany} />
            }
            label="Privacy Policy"
            onPress={() => {
              handleCloseFromOverlay();
              router.push("/privacy" as any);
            }}
          />

          <MenuItem
            icon={
              <MaterialIcons name="description" size={20} color={palette.mahogany} />
            }
            label="Terms & Conditions"
            onPress={() => {
              handleCloseFromOverlay();
              router.push("/terms" as any);
            }}
          />

          <View style={styles.separatorSmall} />
          <MenuItem
            icon={<Ionicons name="log-out-outline" size={20} color={palette.danger} />}
            label="Log Out"
            labelStyle={{ color: palette.danger }}
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
    backgroundColor: "rgba(33,24,20,0.38)",
  },
  modalContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: 320,
    backgroundColor: palette.cream,
    padding: spacing.lg,
    paddingTop: 54,
    borderTopRightRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
    ...shadow.medium,
  },
  profileCard: {
    alignItems: "center",
    marginBottom: spacing.sm,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: palette.white,
    borderWidth: 1,
    borderColor: palette.border,
  },
  avatarCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: palette.parchment,
    borderWidth: 2,
    borderColor: palette.gold,
    alignItems: "center",
    justifyContent: "center",
  },
  profileName: {
    fontSize: 17,
    fontWeight: "800",
    color: palette.ink,
    marginTop: 10,
  },
  profileEmail: { fontSize: 13, color: palette.muted, marginTop: 4 },
  separator: { height: 1, backgroundColor: palette.border, marginVertical: 10 },
  separatorSmall: { height: 8 },
  menuItemActive: { backgroundColor: palette.parchment, borderRadius: radius.md },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 11,
    paddingHorizontal: 10,
    borderRadius: radius.md,
  },
  menuIcon: { width: 32, alignItems: "center", justifyContent: "center" },
  menuLabel: {
    fontSize: 14,
    color: palette.mahogany,
    marginLeft: 6,
    fontWeight: "800",
  },
  itemSeparator: {
    height: 1,
    backgroundColor: "rgba(234,223,210,0.72)",
    marginVertical: 5,
    marginLeft: 40,
    marginRight: 8,
  },
});
