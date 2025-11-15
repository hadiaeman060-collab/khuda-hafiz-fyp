import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import BottomNavBar from "../components/BottomNavBar"; // ✅ Your existing nav bar component
import { useRouter } from "expo-router";

export default function HelpPage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* ====== Header ====== */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="menu" size={26} color="#5C3D2E" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color="#5C3D2E" />
        </TouchableOpacity>
      </View>

      {/* ====== Content Scroll ====== */}
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Illustration */}
        <Image
          source={require("../assets/images/help-illustration.png")} // 📁 Add your illustration here
          style={styles.image}
          resizeMode="contain"
        />

        {/* Text */}
        <Text style={styles.heading}>How we can help you?</Text>
        <Text style={styles.subText}>
          We've provided a comprehensive FAQ section to address the most common
          questions and concerns. From account setup to troubleshooting, you'll
          find detailed answers to help you navigate our platform with ease.
        </Text>

        {/* ====== Help Options ====== */}
        <View style={styles.optionsContainer}>
          <View style={styles.optionBox}>
            <Ionicons name="book-outline" size={24} color="#5C3D2E" />
            <Text style={styles.optionTitle}>FAQs</Text>
            <Text style={styles.optionDesc}>Need clarity? We’re here to help.</Text>
          </View>

          <View style={styles.optionBox}>
            <Ionicons name="call-outline" size={24} color="#5C3D2E" />
            <Text style={styles.optionTitle}>Contact Us</Text>
            <Text style={styles.optionDesc}>
              We’re here to support you in every step.
            </Text>
          </View>

          <View style={styles.optionBox}>
            <MaterialCommunityIcons
              name="headset"
              size={24}
              color="#5C3D2E"
            />
            <Text style={styles.optionTitle}>Tech Support</Text>
            <Text style={styles.optionDesc}>
              Need help with technical problems?
            </Text>
          </View>

          <View style={styles.optionBox}>
            <FontAwesome5 name="user-lock" size={22} color="#5C3D2E" />
            <Text style={styles.optionTitle}>Account Issues</Text>
            <Text style={styles.optionDesc}>
              Trouble logging in or accessing your account?
            </Text>
          </View>
        </View>

        {/* ====== Message Button ====== */}
        <TouchableOpacity
  style={styles.messageButton}
  onPress={() => router.push("/chatbot")}
>
  <Text style={styles.messageButtonText}>Send us a message</Text>
</TouchableOpacity>
      </ScrollView>

      {/* ====== Bottom Nav Bar ====== */}
      <BottomNavBar
        activeTab="Contact"
        onHomePress={() => router.push("/home")}
        onPackagesPress={() => router.push("/basic-package")}
        onContactPress={() => router.push("/contact")}
        onMessagePress={() => router.push("/chatbot")}
        onCallPress={() => alert("Calling Khuda Hafiz...")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  header: {
    marginTop: 50,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 180,
    marginTop: 10,
  },
  heading: {
    fontSize: 20,
    fontWeight: "700",
    color: "#3C2A21",
    textAlign: "center",
    marginTop: 10,
  },
  subText: {
    color: "#555",
    textAlign: "center",
    paddingHorizontal: 25,
    marginTop: 6,
    fontSize: 13,
    lineHeight: 18,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 20,
  },
  optionBox: {
    backgroundColor: "#F7F4F2",
    width: "40%",
    margin: 10,
    borderRadius: 15,
    paddingVertical: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  optionTitle: {
    fontWeight: "700",
    color: "#3C2A21",
    fontSize: 13,
    marginTop: 6,
  },
  optionDesc: {
    color: "#555",
    fontSize: 11,
    textAlign: "center",
    marginTop: 4,
    paddingHorizontal: 5,
  },
  messageButton: {
    backgroundColor: "#3C2A21",
    marginHorizontal: 60,
    marginTop: 25,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  messageButtonText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "600",
  },
});
