import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import TopBar from "../components/TopBar";
import BottomNavBar from "../components/BottomNavBar";

export default function GuidanceScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.container}>
        <TopBar
          showBack
          title="Guidance"
          onBackPress={() => router.back()}
          onBellPress={() => router.push("/notifications" as any)}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >

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

        <BottomNavBar activeTab="Home" />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff8ef" },
  scrollContent: {
    paddingBottom: 112,
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
    borderRadius: 18,
    padding: 12,
  },
  stepIcon: { width: 40, height: 40, marginRight: 12, tintColor: "#8B4513" },
  stepText: { flex: 1 },
  stepTitle: { fontSize: 14, fontWeight: "600", marginBottom: 4 },
  stepDesc: { fontSize: 13, color: "#444", lineHeight: 18 },
});
