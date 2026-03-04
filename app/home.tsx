import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import TopBar from "../components/TopBar";
import BottomNavBar from "../components/BottomNavBar";
import FloatingSearchButton from "../components/FloatingSearchGraveButton";
import MenuModal from "../components/MenuModal";


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

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Banner Section */}
          <View style={styles.bannerContainer}>
            <Text style={styles.bannerText}>
              Graceful Goodbyes, Simplified with Technology
            </Text>
            <Image
              source={require("../assets/images/banner2.png")}
              style={[styles.banner, { marginTop: 10 }]}
              resizeMode="cover"
            />
          </View>

          {/* Services Offered */}
          <Text style={styles.sectionTitle}>Services Offered</Text>
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

          {/* Special Services */}
          <Text style={styles.sectionTitle}>Special Services</Text>
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

          {/* Guidance */}
          <Text style={styles.sectionTitle}>Guidance</Text>
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
  <TouchableOpacity style={styles.serviceItem} onPress={onPress}>
    <View style={[styles.iconCircle, { backgroundColor: bgColor }]}>
      <Image source={icon} style={styles.serviceIcon} />
    </View>
    <Text style={styles.serviceLabel}>{label}</Text>
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
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardDesc}>{desc}</Text>
  </TouchableOpacity>
);

//
// Styles
//
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  bannerContainer: { paddingHorizontal: 15, marginTop: 10 },
  banner: { width: "100%", height: 120, borderRadius: 12 },
  bannerText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginVertical: 15,
    color: "#3c1a06",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 15,
    marginTop: 20,
    marginBottom: 10,
  },
  servicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginHorizontal: 15,
    marginBottom: 2,
  },
  centeredServiceRow: {
    alignItems: "center",
    marginHorizontal: 15,
    marginBottom: 8,
  },
  serviceItem: {
    width: "31.5%",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eee4d8",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  serviceIcon: { width: 36, height: 36, resizeMode: "contain" },
  serviceLabel: { fontSize: 13, color: "#2d2d2d", fontWeight: "600" },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 15,
    marginBottom: 15,
  },
  card: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 12,
    marginRight: 10,
  },
  cardImage: {
    width: "100%",
    height: 80,
    borderRadius: 8,
    marginBottom: 10,
  },
  cardTitle: { fontSize: 14, fontWeight: "bold", marginBottom: 5 },
  cardDesc: { fontSize: 12, color: "#666" },
  guidanceCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  guidanceImage: { width: 60, height: 60, marginRight: 15, borderRadius: 8 },
  guidanceText: { flex: 1, fontSize: 13, color: "#333" },
  /* modal moved into components/MenuModal.tsx */
});


