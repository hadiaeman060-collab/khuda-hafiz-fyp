import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { Stack, useRouter } from "expo-router";

export default function GuidanceScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Top Bar */}
          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => router.back()}>
              <Image
                source={require("../assets/icons/back.png")}
                style={styles.topIcon}
              />
            </TouchableOpacity>
            <Text style={styles.topTitle}>Guidance</Text>
            <TouchableOpacity>
              <Image
                source={require("../assets/icons/bell.png")}
                style={styles.topIcon}
              />
            </TouchableOpacity>
          </View>

          {/* Checklist Section */}
          <Text style={styles.sectionTitle}>Checklist in preparation:</Text>
          <View style={styles.checklist}>
            <Text style={styles.checkItem}>
              1. Only same-gender should perform ghusl, except for the spouse.
            </Text>
            <Text style={styles.checkItem}>
              2. Do ghusl in a clean, private place.
            </Text>
            <Text style={styles.checkItem}>
              3. Keep the deceased’s ‘awrah covered at all times.
            </Text>
            <Text style={styles.checkItem}>
              4. Being in wudu while giving ghusl is Sunnah, not obligatory.
            </Text>
            <Text style={styles.checkItem}>
              5. Ensure the washing water is warm.
            </Text>
          </View>

          {/* Step-by-step Section */}
          <Text style={styles.sectionTitle}>
            Step-by-Step Ghusl for the Maiyah
          </Text>

          <View style={styles.step}>
            <Image
              source={require("../assets/icons/step1.png")}
              style={styles.stepIcon}
            />
            <View style={styles.stepText}>
              <Text style={styles.stepTitle}>1. Start with Bismillah</Text>
              <Text style={styles.stepDesc}>
                Clean away any impurities from the body using warm water. Mainly
                around the aurah area but can be elsewhere.
              </Text>
            </View>
          </View>

          <View style={styles.step}>
            <Image
              source={require("../assets/icons/step2.png")}
              style={styles.stepIcon}
            />
            <View style={styles.stepText}>
              <Text style={styles.stepTitle}>
                2. Privacy & Clean the private parts
              </Text>
              <Text style={styles.stepDesc}>
                Gently press the stomach to release any waste if necessary. Clean
                the private parts with water using cotton or a cloth.
              </Text>
            </View>
          </View>

          <View style={styles.step}>
            <Image
              source={require("../assets/icons/step3.png")}
              style={styles.stepIcon}
            />
            <View style={styles.stepText}>
              <Text style={styles.stepTitle}>3. Perform Wudhu</Text>
              <Text style={styles.stepDesc}>
                Perform wudhu for the deceased without rinsing the mouth or nose
                (You may use a piece of wet cotton for nose and front teeth).
              </Text>
            </View>
          </View>

          <View style={styles.step}>
            <Image
              source={require("../assets/icons/step4.png")}
              style={styles.stepIcon}
            />
            <View style={styles.stepText}>
              <Text style={styles.stepTitle}>
                4. Wash the body (3 times or odd number of times)
              </Text>
              <Text style={styles.stepDesc}>
                Wash the right side of the body from top to bottom. Wash the left
                side of the body from top to bottom.
              </Text>
            </View>
          </View>

          <View style={styles.step}>
            <Image
              source={require("../assets/icons/step5.png")}
              style={styles.stepIcon}
            />
            <View style={styles.stepText}>
              <Text style={styles.stepTitle}>5. Dry the body and Shroud</Text>
              <Text style={styles.stepDesc}>
                Dry the body gently with a clean towel. Wrap the body in the
                shroud (kafan) according to Islamic guidelines.
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={styles.navbar}>
          <NavItem
            label="Home"
            icon={require("../assets/icons/home.png")}
            active
          />
          <NavItem
            label="Packages"
            icon={require("../assets/icons/packages.png")}
          />

          {/* Floating Call Button */}
          <TouchableOpacity style={styles.callButton}>
            <Image
              source={require("../assets/icons/call.png")}
              style={styles.callIcon}
            />
          </TouchableOpacity>

          <NavItem
            label="Contact"
            icon={require("../assets/icons/contact.png")}
          />
          <NavItem
            label="Message"
            icon={require("../assets/icons/message.png")}
          />
        </View>
      </View>
    </>
  );
}

//
// Reusable Nav Item
//
type NavItemProps = {
  label: string;
  icon: any;
  active?: boolean;
};

const NavItem = ({ label, icon, active }: NavItemProps) => (
  <TouchableOpacity style={styles.navItem}>
    <Image
      source={icon}
      style={[styles.navIcon, active && styles.activeIcon]}
    />
    <Text style={[styles.navLabel, active && styles.activeLabel]}>{label}</Text>
  </TouchableOpacity>
);

//
// Styles
//
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  // Top Bar
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  topIcon: { width: 24, height: 24, tintColor: "#8B4513" },
  topTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3c1a06",
  },

  // Sections
  sectionTitle: {
    fontSize: 15,
    fontWeight: "bold",
    marginHorizontal: 15,
    marginTop: 20,
    marginBottom: 10,
    color: "#3c1a06",
  },

  // Checklist
  checklist: { marginHorizontal: 20 },
  checkItem: {
    fontSize: 13,
    color: "#333",
    marginBottom: 8,
    lineHeight: 18,
  },

  // Steps
  step: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginHorizontal: 15,
    marginBottom: 18,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 12,
  },
  stepIcon: { width: 40, height: 40, marginRight: 12, tintColor: "#8B4513" },
  stepText: { flex: 1 },
  stepTitle: { fontSize: 14, fontWeight: "600", marginBottom: 4 },
  stepDesc: { fontSize: 13, color: "#444", lineHeight: 18 },

  // Navbar
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },
  navItem: { alignItems: "center" },
  navIcon: { width: 22, height: 22, marginBottom: 2 },
  navLabel: { fontSize: 10, color: "#666" },
  activeIcon: { tintColor: "#8B4513" },
  activeLabel: { color: "#8B4513", fontWeight: "600" },
  callButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginTop: -30,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  callIcon: { width: 28, height: 28, tintColor: "#8B4513" },
});
