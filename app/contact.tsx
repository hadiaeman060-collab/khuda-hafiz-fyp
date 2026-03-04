import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import TopBar from "../components/TopBar";
import BottomNavBar from "../components/BottomNavBar";
import { Ionicons, MaterialIcons, FontAwesome, AntDesign } from "@expo/vector-icons"; // ✅ all icon packs

export default function ContactScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Top Bar */}
          <TopBar
            showBack
            onBellPress={() => router.push("/notifications" as any)}
            onBackPress={() => router.back()}
          />

          {/* Title */}
          <Text style={styles.heading}>Get in Touch</Text>

          {/* Illustration */}
          <Image
            source={require("../assets/images/illustration.png")}
            style={styles.image}
            resizeMode="contain"
          />

          {/* Subtitle */}
          <Text style={styles.subtitle}>We'd love to hear from you.</Text>

          {/* Contact Options */}
          <View style={styles.contactBox}>
            <Ionicons name="call-outline" size={20} color="#5a3d2b" style={styles.icon} />
            <Text style={styles.contactText}>0800-786-786</Text>
          </View>

          <View style={styles.contactBox}>
            <MaterialIcons name="email" size={20} color="#5a3d2b" style={styles.icon} />
            <Text style={styles.contactText}>khudahafiz.co@gmail.com</Text>
          </View>

          {/* Social Media */}
          <Text style={styles.sectionTitle}>Social Media</Text>

          <View style={styles.socialRow}>
            <FontAwesome name="facebook-square" size={32} color="#1877F2" style={styles.socialIcon} />
            <View>
              <Text style={styles.socialTitle}>khudahafiz.co</Text>
              <Text style={styles.socialDesc}>
                Stay updated, connected and engaged with us.
              </Text>
            </View>
          </View>

          <View style={styles.socialRow}>
            <AntDesign name="instagram" size={32} color="#E1306C" style={styles.socialIcon} />
            <View>
              <Text style={styles.socialTitle}>khudahafiz.co</Text>
              <Text style={styles.socialDesc}>
                Explore our visual world and discover the beauty of remembrance,
                compassion, and care.
              </Text>
            </View>
          </View>

          <View style={styles.socialRow}>
            <FontAwesome name="linkedin-square" size={32} color="#0077B5" style={styles.socialIcon} />
            <View>
              <Text style={styles.socialTitle}>Khudahafiz.co</Text>
              <Text style={styles.socialDesc}>
                Follow us for real time updates and discussions.
              </Text>
            </View>
          </View>

          {/* Note Box */}
          <View style={styles.noteBox}>
            <Text style={styles.noteText}>
              Note: While our full platform is still in development, we're
              already helping organizations with tech solutions. Reach out to
              learn more!
            </Text>
          </View>

          {/* Need Help Button */}
          <TouchableOpacity
  style={styles.helpButton}
  onPress={() => router.push("/help")}  // ✅ Navigate to HelpPage
>
  <Text style={styles.helpText}>Need Help?</Text>
</TouchableOpacity>
        </ScrollView>

        {/* Bottom Navigation */}
        <BottomNavBar activeTab="Contact" />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  heading: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
    color: "#5a3d2b",
    marginTop: 10,
  },
  image: {
    width: 180,
    height: 160,
    alignSelf: "center",
    marginTop: 20,
  },
  subtitle: {
    textAlign: "center",
    fontSize: 14,
    color: "#444",
    marginTop: 8,
    marginBottom: 20,
  },
  contactBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginHorizontal: 25,
    marginBottom: 12,
  },
  icon: {
    marginRight: 10,
  },
  contactText: {
    fontSize: 14,
    color: "#333",
  },
  sectionTitle: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
    color: "#5a3d2b",
    marginTop: 25,
    marginBottom: 10,
  },
  socialRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 25,
    marginBottom: 20,
    gap: 12,
  },
  socialIcon: {
    width: 32,
    height: 32,
  },
  socialTitle: {
    fontWeight: "600",
    color: "#000",
  },
  socialDesc: {
    fontSize: 13,
    color: "#444",
    lineHeight: 18,
  },
  noteBox: {
    backgroundColor: "#f9f7f3",
    marginHorizontal: 25,
    borderRadius: 10,
    padding: 14,
    marginTop: 10,
  },
  noteText: {
    fontSize: 13,
    color: "#333",
    textAlign: "center",
    lineHeight: 18,
  },
  helpButton: {
    backgroundColor: "#5a3d2b",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 100,
    marginTop: 20,
    marginBottom: 100,
  },
  helpText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});
