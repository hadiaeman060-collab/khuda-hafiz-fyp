import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useNotifications } from "../app/context/NotificationContext";

type TopBarProps = {
  showBack?: boolean;
  showMenu?: boolean;
  title?: string;
  showLocation?: boolean;
  onBackPress?: () => void;
  onMenuPress?: () => void;
  onBellPress?: () => void;
};

export default function TopBar({
  showBack = false,
  showMenu = false,
  title = "",
  showLocation = false,
  onBackPress,
  onMenuPress,
  onBellPress,
}: TopBarProps) {
  const router = useRouter();
  const { unreadCount } = useNotifications();
  const [locationText, setLocationText] = useState("Fetching location...");

  useEffect(() => {
    if (showLocation) {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setLocationText("Location access denied");
          return;
        }

        let loc = await Location.getCurrentPositionAsync({});
        let reverseGeocode = await Location.reverseGeocodeAsync({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });

        if (reverseGeocode.length > 0) {
          const city = reverseGeocode[0].city || reverseGeocode[0].region;
          const country = reverseGeocode[0].country;
          setLocationText(`${city}, ${country}`);
        } else {
          setLocationText("Unknown location");
        }
      })();
    }
  }, [showLocation]);

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.safeArea}>
      <View style={styles.topBar}>
        {showMenu ? (
          <TouchableOpacity
            onPress={onMenuPress || (() => alert("Menu opened"))}
          >
            <Image
              source={require("../assets/icons/menu.png")}
              style={styles.topIcon}
            />
          </TouchableOpacity>
        ) : showBack ? (
          <TouchableOpacity onPress={onBackPress || (() => router.back())}>
            <Ionicons name="chevron-back" size={26} color="#5a3d2b" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 26 }} />
        )}

        {showLocation ? (
          <Text style={styles.locationText}>📍 {locationText}</Text>
        ) : (
          <Text style={styles.titleText}>{title}</Text>
        )}

        <TouchableOpacity
          onPress={onBellPress || (() => router.push("/notifications" as any))}
          style={styles.bellWrap}
        >
          <Image
            source={require("../assets/icons/bell.png")}
            style={styles.topIcon}
          />
          {unreadCount > 0 ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {unreadCount > 99 ? "99+" : unreadCount}
              </Text>
            </View>
          ) : null}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#fff",
  },

  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  topIcon: {
    width: 26,
    height: 26,
    tintColor: "#5a3d2b",
  },
  bellWrap: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -6,
    right: -8,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#c62828",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
  titleText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  locationText: {
    fontSize: 14,
    color: "#5a3d2b",
    fontWeight: "500",
  },
});
