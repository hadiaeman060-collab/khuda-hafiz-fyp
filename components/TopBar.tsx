import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useNotifications } from "../app/context/NotificationContext";
import { palette, radius, shadow, spacing } from "../constants/theme";

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
    if (!showLocation) return;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocationText("Location access denied");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      const reverseGeocode = await Location.reverseGeocodeAsync({
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
  }, [showLocation]);

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.safeArea}>
      <View style={styles.topBar}>
        {showMenu ? (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onMenuPress || (() => alert("Menu opened"))}
          >
            <Image
              source={require("../assets/icons/menu.png")}
              style={styles.topIcon}
            />
          </TouchableOpacity>
        ) : showBack ? (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onBackPress || (() => router.back())}
          >
            <Ionicons name="chevron-back" size={24} color={palette.brown} />
          </TouchableOpacity>
        ) : (
          <View style={styles.iconButtonPlaceholder} />
        )}

        {showLocation ? (
          <View style={styles.locationPill}>
            <Ionicons name="location" size={14} color={palette.brown} />
            <Text style={styles.locationText} numberOfLines={1}>
              {locationText}
            </Text>
          </View>
        ) : (
          <Text style={styles.titleText} numberOfLines={1}>
            {title}
          </Text>
        )}

        <TouchableOpacity
          onPress={onBellPress || (() => router.push("/notifications" as any))}
          style={[styles.iconButton, styles.bellWrap]}
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
    backgroundColor: palette.cream,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    backgroundColor: "rgba(255,255,255,0.94)",
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radius.lg,
    ...shadow.soft,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: palette.parchment,
    alignItems: "center",
    justifyContent: "center",
  },
  iconButtonPlaceholder: {
    width: 42,
    height: 42,
  },
  topIcon: {
    width: 22,
    height: 22,
    tintColor: palette.brown,
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
    backgroundColor: palette.danger,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: palette.white,
  },
  badgeText: {
    color: palette.white,
    fontSize: 10,
    fontWeight: "700",
  },
  titleText: {
    flex: 1,
    textAlign: "center",
    fontSize: 17,
    fontWeight: "800",
    color: palette.ink,
    marginHorizontal: spacing.sm,
  },
  locationPill: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 9,
    borderRadius: radius.pill,
    backgroundColor: palette.parchment,
  },
  locationText: {
    flexShrink: 1,
    fontSize: 13,
    color: palette.brown,
    fontWeight: "700",
    marginLeft: 5,
  },
});
