import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import * as Location from "expo-location";
import { useRouter } from "expo-router";

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
    <View style={styles.topBar}>
      {showMenu ? (
        <TouchableOpacity onPress={onMenuPress || (() => alert("Menu opened"))}>
          <Image
            source={require("../assets/icons/menu.png")}
            style={styles.topIcon}
          />
        </TouchableOpacity>
      ) : showBack ? (
        <TouchableOpacity onPress={onBackPress || (() => router.back())}>
          <Image
            source={require("../assets/icons/back.png")}
            style={styles.topIcon}
          />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 26 }} />
      )}

      {showLocation ? (
        <Text style={styles.locationText}>📍 {locationText}</Text>
      ) : (
        <Text style={styles.titleText}>{title}</Text>
      )}

      <TouchableOpacity onPress={onBellPress || (() => alert("Notifications"))}>
        <Image
          source={require("../assets/icons/bell.png")}
          style={styles.topIcon}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
