import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import TopBar from "../components/TopBar";
import BottomNavBar from "../components/BottomNavBar";
import FloatingSearchButton from "../components/FloatingSearchGraveButton";
import MenuModal from "../components/MenuModal";
import { palette, radius, shadow, spacing } from "../constants/theme";


export default function HomeScreen() {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const services = [
    {
      label: "Grave",
      icon: require("../assets/icons/grave.png"),
      bgColor: "#FBE5C8",
      route: "/grave",
    },
    {
      label: "Shroud",
      icon: require("../assets/icons/shroud.png"),
      bgColor: "#4E342E",
      route: "/shrouds",
    },
    {
      label: "Support",
      icon: require("../assets/icons/support.png"),
      bgColor: "#F8C8D9",
      route: "/support",
    },
    {
      label: "Catering",
      icon: require("../assets/icons/catering.png"),
      bgColor: "#F4C07A",
      route: "/catering",
    },
    {
      label: "Logistics",
      icon: require("../assets/icons/logistics.png"),
      bgColor: "#A5D6A7",
      route: "/logistics",
    },
    {
      label: "NGO",
      icon: require("../assets/icons/ngo.png"),
      bgColor: "#90CAF9",
      route: "/ngo",
    },
    {
      label: "Chat Us",
      icon: require("../assets/icons/message.png"),
      bgColor: "#FFE39B",
      route: "/chatbot",
    },
  ];
  const chatService = services.find((s) => s.label === "Chat Us");
  const primaryServices = services.filter((s) => s.label !== "Chat Us");

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        {/* Reusable TopBar */}
        <TopBar
          title=""
          showLocation
          showMenu
          onMenuPress={() => setMenuVisible(true)}
          onBellPress={() => router.push("/notifications" as any)}
        />

        <MenuModal
          visible={menuVisible}
          onClose={() => setMenuVisible(false)}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <LinearGradient
            colors={["#2b1208", "#5a3d2b", "#b9824c"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroCard}
          >
            <View style={styles.heroCopy}>
              <Text style={styles.heroKicker}>Khuda Hafiz Care</Text>
              <Text style={styles.bannerText}>
                Graceful goodbyes, guided with calm technology.
              </Text>
              <Text style={styles.heroSubtext}>
                Burial services, support, guidance, and urgent help in one
                dignified place.
              </Text>
            </View>
            <Image
              source={require("../assets/images/banner2.png")}
              style={styles.banner}
              resizeMode="cover"
            />
          </LinearGradient>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Services Offered</Text>
            <Text style={styles.sectionMeta}>Tap to arrange</Text>
          </View>
          <View style={styles.servicesGrid}>
            {primaryServices.map((service) => (
              <ServiceItem
                key={service.label}
                label={service.label}
                icon={service.icon}
                bgColor={service.bgColor}
                onPress={() => router.push(service.route as any)}
              />
            ))}
          </View>
          {chatService ? (
            <View style={styles.centeredServiceRow}>
              <ServiceItem
                label={chatService.label}
                icon={chatService.icon}
                bgColor={chatService.bgColor}
                onPress={() => router.push(chatService.route as any)}
              />
            </View>
          ) : null}

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Special Services</Text>
            <Text style={styles.sectionMeta}>Smart assistance</Text>
          </View>
          <View style={styles.cardRow}>
            <ServiceCard
              title="AI Integration"
              desc="Islamic shrouds - standard, custom, or donated."
              image={require("../assets/images/ai-integration-image.png")}
              onPress={() => router.push("/ai-integration")}
            />
            <ServiceCard
              title="Tech Consultation"
              desc="Islamic shrouds - standard, custom, or donated."
              image={require("../assets/images/tech.png")}
              onPress={() => router.push("/tech-consultation")}
            />
          </View>
          <View style={styles.cardRow}>
            <ServiceCard
              title="Grief Consult"
              desc="Islamic shrouds - standard, custom, or donated."
              image={require("../assets/images/grief.png")}
              onPress={() => router.push("/grief-consult")}
            />
            <ServiceCard
              title="Funeral Plan"
              desc="Islamic shrouds - standard, custom, or donated."
              image={require("../assets/images/funeral.png")}
              onPress={() => router.push("/funeral-plan")}
            />
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Guidance</Text>
            <Text style={styles.sectionMeta}>Step-by-step</Text>
          </View>
          <TouchableOpacity
            style={styles.guidanceCard}
            onPress={() => router.push("/guidance")}
          >
            <Image
              source={require("../assets/images/ghusl.png")}
              style={styles.guidanceImage}
            />
            <Text style={styles.guidanceText}>
              Step-by-step guidance on performing the ghusal (ritual washing) of
              a deceased person according to Islamic teachings.
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Reusable BottomNavBar */}
        <FloatingSearchButton />
        <BottomNavBar activeTab="Home" />
      </View>
    </>
  );
}

//
// Reusable Inner Components
//
type ServiceItemProps = {
  label: string;
  icon: any;
  bgColor: string;
  onPress?: () => void;
};

const ServiceItem = ({ label, icon, bgColor, onPress }: ServiceItemProps) => (
  <TouchableOpacity
    style={styles.serviceItem}
    onPress={onPress}
    activeOpacity={0.86}
  >
    <BlurView intensity={46} tint="light" style={styles.serviceGlass}>
      <LinearGradient
        colors={[
          "rgba(255,255,255,0.7)",
          "rgba(255,248,239,0.18)",
          "rgba(216,170,98,0.2)",
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.crystalWash}
      />
      <View style={styles.glassHighlight} />
      <View style={styles.glassFacet} />
      <View style={styles.glassFacetSmall} />
      <View style={styles.glassShard} />
      <View style={styles.glassShardSecond} />
      <View style={[styles.iconCircle, { backgroundColor: bgColor }]}>
        <Image source={icon} style={styles.serviceIcon} />
      </View>
      <View style={styles.labelPill}>
        <Text style={styles.serviceLabel} numberOfLines={1}>
          {label}
        </Text>
      </View>
    </BlurView>
    <View style={styles.serviceGlow} />
  </TouchableOpacity>
);

type ServiceCardProps = {
  title: string;
  desc: string;
  image: any;
  onPress?: () => void;
};

const ServiceCard = ({ title, desc, image, onPress }: ServiceCardProps) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Image source={image} style={styles.cardImage} />
    <View style={styles.cardBody}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDesc}>{desc}</Text>
    </View>
  </TouchableOpacity>
);

//
// Styles
//
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: palette.cream },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: 112,
  },
  heroCard: {
    minHeight: 210,
    borderRadius: radius.xl,
    padding: spacing.lg,
    overflow: "hidden",
    ...shadow.medium,
  },
  heroCopy: {
    width: "62%",
    zIndex: 1,
  },
  heroKicker: {
    color: "#f3d390",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0,
    textTransform: "uppercase",
    marginBottom: spacing.sm,
  },
  banner: {
    position: "absolute",
    right: -26,
    bottom: -14,
    width: "56%",
    height: 175,
    borderTopLeftRadius: radius.xl,
    opacity: 0.92,
  },
  bannerText: {
    fontSize: 25,
    lineHeight: 31,
    fontWeight: "900",
    color: palette.white,
  },
  heroSubtext: {
    fontSize: 13,
    lineHeight: 19,
    color: "#f7efe4",
    marginTop: spacing.sm,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: palette.ink,
  },
  sectionMeta: {
    fontSize: 12,
    fontWeight: "800",
    color: palette.bronze,
  },
  servicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  centeredServiceRow: {
    alignItems: "center",
    marginBottom: 8,
  },
  serviceItem: {
    width: "31.5%",
    aspectRatio: 1,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.92)",
    overflow: "hidden",
    shadowColor: palette.bronze,
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 5,
  },
  serviceGlass: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 15,
    paddingBottom: 12,
    paddingHorizontal: 7,
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  crystalWash: {
    ...StyleSheet.absoluteFillObject,
  },
  glassHighlight: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "38%",
    backgroundColor: "rgba(255,255,255,0.3)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.36)",
  },
  glassFacet: {
    position: "absolute",
    top: -28,
    right: -34,
    width: 86,
    height: 118,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.26)",
    transform: [{ rotate: "34deg" }],
  },
  glassFacetSmall: {
    position: "absolute",
    left: -22,
    bottom: -10,
    width: 72,
    height: 72,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.18)",
    transform: [{ rotate: "-28deg" }],
  },
  glassShard: {
    position: "absolute",
    top: 16,
    left: 10,
    width: 2,
    height: 82,
    borderRadius: 1,
    backgroundColor: "rgba(255,255,255,0.72)",
    transform: [{ rotate: "38deg" }],
  },
  glassShardSecond: {
    position: "absolute",
    right: 14,
    bottom: 14,
    width: 1,
    height: 58,
    borderRadius: 1,
    backgroundColor: "rgba(255,255,255,0.48)",
    transform: [{ rotate: "38deg" }],
  },
  serviceGlow: {
    position: "absolute",
    left: 14,
    right: 14,
    bottom: 0,
    height: 2,
    borderRadius: 1,
    backgroundColor: "rgba(255,255,255,0.86)",
  },
  iconCircle: {
    width: 66,
    height: 66,
    borderRadius: 33,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  serviceIcon: { width: 36, height: 36, resizeMode: "contain" },
  labelPill: {
    maxWidth: "100%",
    minHeight: 28,
    justifyContent: "center",
    paddingHorizontal: 9,
    borderRadius: radius.pill,
    backgroundColor: "rgba(255,255,255,0.42)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.55)",
  },
  serviceLabel: {
    fontSize: 12,
    color: palette.ink,
    fontWeight: "900",
    textAlign: "center",
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  card: {
    flex: 1,
    backgroundColor: palette.white,
    borderRadius: radius.lg,
    padding: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: palette.border,
    ...shadow.soft,
  },
  cardImage: {
    width: "100%",
    height: 92,
    borderRadius: radius.md,
    marginBottom: 8,
  },
  cardBody: { paddingHorizontal: 4, paddingBottom: 6 },
  cardTitle: {
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 5,
    color: palette.ink,
  },
  cardDesc: { fontSize: 12, color: palette.muted, lineHeight: 17 },
  guidanceCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: palette.white,
    borderRadius: radius.lg,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: palette.border,
    ...shadow.soft,
  },
  guidanceImage: { width: 72, height: 72, marginRight: 15, borderRadius: 18 },
  guidanceText: { flex: 1, fontSize: 13, color: palette.muted, lineHeight: 19 },
  /* modal moved into components/MenuModal.tsx */
});


