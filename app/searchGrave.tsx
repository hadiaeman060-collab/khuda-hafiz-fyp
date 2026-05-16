import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Linking,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import TopBar from "../components/TopBar";
import {
  getCities,
  getGraveyardsByCity,
  getNearbyGraveyards,
} from "../src/utils/graveyardAPI";
import { palette, radius, shadow, spacing } from "../constants/theme";

type GraveyardApi = {
  _id: string;
  name: string;
  address: string;
  city: string;
  contactNumber?: string;
  location?: { type: "Point"; coordinates: [number, number] };
};

const BROWN = palette.brown;

export default function GraveyardSearchScreen() {
  const router = useRouter();

  const [loadingCities, setLoadingCities] = useState(true);
  const [loadingList, setLoadingList] = useState(false);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [searchMode, setSearchMode] = useState<"city" | "nearby" | null>(null);
  const [detectedPlace, setDetectedPlace] = useState("");
  const [graveyards, setGraveyards] = useState<GraveyardApi[]>([]);

  useEffect(() => {
    (async () => {
      try {
        setLoadingCities(true);
        const cityList = await getCities();
        setCities(cityList);
      } catch (err: any) {
        console.error(err);
        Alert.alert("Error", err.message || "Failed to load cities");
      } finally {
        setLoadingCities(false);
      }
    })();
  }, []);

  const onSelectCity = async (city: string) => {
    setSearchMode("city");
    setDetectedPlace("");
    setSelectedCity(city);

    if (!city) {
      setGraveyards([]);
      return;
    }

    try {
      setLoadingList(true);
      const list = await getGraveyardsByCity(city);
      setGraveyards(list);
    } catch (err: any) {
      console.error(err);
      Alert.alert("Error", err.message || "Failed to load graveyards");
    } finally {
      setLoadingList(false);
    }
  };

  const resolveNearestKnownCity = (rawPlace: string, knownCities: string[]) => {
    const normalizedRaw = rawPlace.toLowerCase().trim();
    return knownCities.find((c) => {
      const normalizedCity = c.toLowerCase().trim();
      return (
        normalizedRaw === normalizedCity ||
        normalizedRaw.includes(normalizedCity) ||
        normalizedCity.includes(normalizedRaw)
      );
    });
  };

  const onSearchNearby = async () => {
    try {
      setLoadingList(true);
      setSearchMode("nearby");
      setSelectedCity("");
      setDetectedPlace("");

      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status !== "granted") {
        Alert.alert(
          "Permission required",
          "Allow location access to search nearby graveyards."
        );
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      const places = await Location.reverseGeocodeAsync({
        latitude: lat,
        longitude: lng,
      });
      const place = places?.[0];
      const locationText =
        place?.city ||
        place?.subregion ||
        place?.region ||
        place?.district ||
        "";
      setDetectedPlace(locationText);

      const matchedCity = locationText
        ? resolveNearestKnownCity(locationText, cities)
        : undefined;
      if (matchedCity) {
        const cityList = await getGraveyardsByCity(matchedCity);
        setSelectedCity(matchedCity);
        setGraveyards(cityList);
        return;
      }

      const nearby = await getNearbyGraveyards(lat, lng, 15000);
      setGraveyards(nearby);
    } catch (err: any) {
      console.error(err);
      Alert.alert("Error", err.message || "Failed to load nearby graveyards");
    } finally {
      setLoadingList(false);
    }
  };

  const handleCall = (phone?: string) => {
    if (!phone) {
      Alert.alert("No Contact", "No contact number available for this graveyard.");
      return;
    }
    Linking.openURL(`tel:${phone}`).catch(() =>
      Alert.alert("Error", "Unable to make a call")
    );
  };

  const handleOpenMap = (g: GraveyardApi) => {
    const coords = g.location?.coordinates;
    if (!coords || coords.length !== 2) {
      Alert.alert("No Location", "No coordinates available for this graveyard.");
      return;
    }
    const [lng, lat] = coords;
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    Linking.openURL(url).catch(() => Alert.alert("Error", "Unable to open maps"));
  };

  const headingText = useMemo(() => {
    if (searchMode === "nearby" && selectedCity) {
      return `Nearby Graveyards in ${selectedCity}`;
    }
    if (searchMode === "nearby" && detectedPlace) {
      return `Nearby Graveyards in ${detectedPlace}`;
    }
    if (searchMode === "nearby") {
      return "Nearby Graveyards";
    }
    if (!selectedCity) return "Search Graveyards by City";
    return `Available Graveyards in ${selectedCity}`;
  }, [selectedCity, searchMode, detectedPlace]);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.container}>
        <TopBar
          showBack
          title="Search Graveyards"
          onBackPress={() => router.back()}
          onBellPress={() => router.push("/notifications" as any)}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <LinearGradient
            colors={["#2b1208", "#5a3d2b", "#b9824c"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.hero}
          >
            <View style={styles.heroIcon}>
              <Ionicons name="map" size={28} color={palette.gold} />
            </View>
            <Text style={styles.heroKicker}>Burial locations</Text>
            <Text style={styles.heroTitle}>
              Find an available graveyard near your family.
            </Text>
            <Text style={styles.heroText}>
              Search by city or use your current location to discover active
              graveyards with contact and map details.
            </Text>

            <View style={styles.heroStats}>
              <View style={styles.statPill}>
                <Text style={styles.statValue}>{cities.length}</Text>
                <Text style={styles.statLabel}>Cities</Text>
              </View>
              <View style={styles.statPill}>
                <Text style={styles.statValue}>{graveyards.length}</Text>
                <Text style={styles.statLabel}>Results</Text>
              </View>
            </View>
          </LinearGradient>

          <View style={styles.searchPanel}>
            <View style={styles.panelHeader}>
              <View style={styles.panelCopy}>
                <Text style={styles.panelTitle}>{headingText}</Text>
                <Text style={styles.panelSubtitle}>
                  Choose a city or scan nearby graveyards.
                </Text>
              </View>
              <View style={styles.panelBadge}>
                <Ionicons name="location" size={16} color={palette.brown} />
              </View>
            </View>

            <View style={styles.pickerCard}>
              {loadingCities ? (
                <View style={styles.rowCenter}>
                  <ActivityIndicator size="small" color={BROWN} />
                  <Text style={styles.pickerLoadingText}>Loading cities...</Text>
                </View>
              ) : (
                <Picker selectedValue={selectedCity} onValueChange={onSelectCity}>
                  <Picker.Item label="-- Select City --" value="" />
                  {cities.map((c) => (
                    <Picker.Item key={c} label={c} value={c} />
                  ))}
                </Picker>
              )}
            </View>

            <TouchableOpacity style={styles.nearbyBtn} onPress={onSearchNearby}>
              <Ionicons name="navigate" size={17} color={palette.white} />
              <Text style={styles.nearbyBtnText}>Search Nearby</Text>
            </TouchableOpacity>
          </View>

          {loadingList ? (
            <View style={styles.stateCard}>
              <ActivityIndicator size="large" color={BROWN} />
              <Text style={styles.loadingText}>Fetching graveyards...</Text>
              <Text style={styles.stateHint}>
                Checking active records and location data.
              </Text>
            </View>
          ) : searchMode === null && !selectedCity ? (
            <EmptyState
              icon="search"
              title="Start with a city"
              message="Select a city above to see available graveyards, or use nearby search for location-based results."
            />
          ) : graveyards.length === 0 && searchMode === "nearby" ? (
            <EmptyState
              icon="navigate-circle"
              title="No nearby graveyards found"
              message="Try selecting your city manually, or increase coverage from the backend nearby search settings."
            />
          ) : graveyards.length === 0 ? (
            <EmptyState
              icon="map-outline"
              title={`No active graveyards in ${selectedCity}`}
              message="There are no active graveyards listed for this city yet."
            />
          ) : (
            <View style={styles.resultsWrap}>
              <View style={styles.resultsHeader}>
                <Text style={styles.resultsTitle}>Available Graveyards</Text>
                <Text style={styles.resultsCount}>{graveyards.length} found</Text>
              </View>

              {graveyards.map((g) => {
                const coords = g.location?.coordinates;
                const lat = coords?.[1];
                const lng = coords?.[0];

                return (
                  <View key={g._id} style={styles.card}>
                    <View style={styles.cardTop}>
                      <View style={styles.cardIcon}>
                        <Ionicons name="leaf" size={20} color={palette.bronze} />
                      </View>
                      <View style={styles.cardTitleWrap}>
                        <Text style={styles.name}>{g.name}</Text>
                        <Text style={styles.address}>{g.address}</Text>
                      </View>
                    </View>

                    <View style={styles.metaGrid}>
                      <InfoPill icon="business" label="City" value={g.city} />
                      <InfoPill
                        icon="call"
                        label="Contact"
                        value={g.contactNumber || "Not available"}
                      />
                    </View>

                    <View style={styles.locationStrip}>
                      <Ionicons name="pin" size={15} color={palette.brown} />
                      <Text style={styles.locationText}>
                        {typeof lat === "number" && typeof lng === "number"
                          ? `${lat.toFixed(6)}, ${lng.toFixed(6)}`
                          : "Location coordinates not available"}
                      </Text>
                    </View>

                    <View style={styles.actions}>
                      <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => handleCall(g.contactNumber)}
                      >
                        <Ionicons name="call" size={15} color={palette.brown} />
                        <Text style={styles.actionText}>Call</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.actionBtn, styles.actionBtnPrimary]}
                        onPress={() => handleOpenMap(g)}
                      >
                        <Ionicons name="map" size={15} color={palette.white} />
                        <Text style={styles.actionTextPrimary}>Open Map</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </ScrollView>
      </View>
    </>
  );
}

type EmptyStateProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  message: string;
};

const EmptyState = ({ icon, title, message }: EmptyStateProps) => (
  <View style={styles.stateCard}>
    <View style={styles.emptyIcon}>
      <Ionicons name={icon} size={28} color={palette.bronze} />
    </View>
    <Text style={styles.emptyTitle}>{title}</Text>
    <Text style={styles.emptyMessage}>{message}</Text>
  </View>
);

type InfoPillProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
};

const InfoPill = ({ icon, label, value }: InfoPillProps) => (
  <View style={styles.infoPill}>
    <Ionicons name={icon} size={14} color={palette.brown} />
    <View style={styles.infoTextWrap}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue} numberOfLines={1}>
        {value}
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: palette.cream },
  content: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl,
  },
  hero: {
    borderRadius: radius.xl,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    overflow: "hidden",
    ...shadow.medium,
  },
  heroIcon: {
    width: 54,
    height: 54,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  heroKicker: {
    color: palette.gold,
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
    marginBottom: 8,
  },
  heroTitle: {
    color: palette.white,
    fontSize: 26,
    lineHeight: 32,
    fontWeight: "900",
  },
  heroText: {
    color: "#f7efe4",
    fontSize: 13,
    lineHeight: 20,
    marginTop: spacing.sm,
  },
  heroStats: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  statPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
  statValue: {
    color: palette.white,
    fontSize: 15,
    fontWeight: "900",
    marginRight: 6,
  },
  statLabel: {
    color: "#f7efe4",
    fontSize: 12,
    fontWeight: "700",
  },
  searchPanel: {
    backgroundColor: palette.white,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: palette.border,
    marginBottom: spacing.lg,
    ...shadow.soft,
  },
  panelHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.md,
  },
  panelCopy: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: palette.ink,
  },
  panelSubtitle: {
    fontSize: 12,
    color: palette.muted,
    marginTop: 4,
  },
  panelBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: palette.parchment,
    alignItems: "center",
    justifyContent: "center",
  },
  pickerCard: {
    backgroundColor: palette.cream,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: palette.border,
    overflow: "hidden",
  },
  rowCenter: { flexDirection: "row", alignItems: "center", padding: 12 },
  pickerLoadingText: { marginLeft: 10, color: palette.muted },
  nearbyBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.pill,
    paddingVertical: 13,
    paddingHorizontal: spacing.lg,
    backgroundColor: palette.mahogany,
    ...shadow.glow,
  },
  nearbyBtnText: {
    color: palette.white,
    fontWeight: "900",
    fontSize: 14,
    marginLeft: 8,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: palette.ink,
    fontWeight: "800",
  },
  stateHint: {
    color: palette.muted,
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
  },
  stateCard: {
    alignItems: "center",
    backgroundColor: palette.white,
    borderRadius: radius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: palette.border,
    ...shadow.soft,
  },
  emptyIcon: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: palette.parchment,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: palette.ink,
    textAlign: "center",
  },
  emptyMessage: {
    fontSize: 13,
    lineHeight: 20,
    color: palette.muted,
    textAlign: "center",
    marginTop: 8,
  },
  resultsWrap: {
    gap: spacing.sm,
  },
  resultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: palette.ink,
  },
  resultsCount: {
    color: palette.bronze,
    fontSize: 12,
    fontWeight: "900",
  },
  card: {
    backgroundColor: palette.white,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: palette.border,
    ...shadow.soft,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  cardIcon: {
    width: 42,
    height: 42,
    borderRadius: 16,
    backgroundColor: palette.parchment,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  cardTitleWrap: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: "900",
    color: BROWN,
  },
  address: {
    fontSize: 13,
    color: palette.muted,
    marginTop: 4,
    lineHeight: 18,
  },
  metaGrid: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  infoPill: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: palette.cream,
    borderRadius: radius.md,
    padding: spacing.sm,
  },
  infoTextWrap: {
    marginLeft: 7,
    flex: 1,
  },
  infoLabel: {
    fontSize: 10,
    color: palette.faint,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  infoValue: {
    fontSize: 12,
    color: palette.ink,
    fontWeight: "800",
    marginTop: 2,
  },
  locationStrip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: palette.parchment,
    borderRadius: radius.md,
    padding: spacing.sm,
    marginTop: spacing.sm,
  },
  locationText: {
    flex: 1,
    color: palette.muted,
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 7,
  },
  actions: {
    flexDirection: "row",
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: BROWN,
    borderRadius: radius.pill,
    paddingVertical: 11,
  },
  actionBtnPrimary: {
    backgroundColor: palette.mahogany,
    borderColor: palette.mahogany,
  },
  actionText: {
    fontSize: 13,
    color: BROWN,
    fontWeight: "900",
    marginLeft: 6,
  },
  actionTextPrimary: {
    fontSize: 13,
    color: palette.white,
    fontWeight: "900",
    marginLeft: 6,
  },
});
