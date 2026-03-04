import React from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { Stack } from "expo-router";
import TopBar from "../components/TopBar";
import BottomNavBar from "../components/BottomNavBar";
import FloatingSearchButton from "../components/FloatingSearchGraveButton";

export default function About() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <TopBar
          title="About Us"
          showBack={true}
          showMenu={false}
          showLocation={false}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          <View style={styles.headerSection}>
            <Text style={styles.headerTitle}>Our Story</Text>
            <Text style={styles.headerText}>
              In Pakistan, conversations around death and funeral services are
              often met with silence. We believe this silence creates burden
              during the most difficult times in our lives.
            </Text>
          </View>

          <View style={styles.cardSection}>
            <View style={[styles.card, styles.cardShadow]}>
              <View style={styles.cardContent}>
                <View style={styles.cardTextWrap}>
                  <Text style={styles.cardTitle}>Our Mission</Text>
                  <Text style={styles.cardBody}>
                    Our vision goes beyond funerals as we are building a digital
                    ecosystem to empower NGOs, social groups, and communities
                    with innovative tech solutions.
                  </Text>
                </View>
                <Image
                  source={require("../assets/images/ai-integration-image.png")}
                  style={styles.cardImage}
                />
              </View>
            </View>

            <View style={[styles.card, styles.cardShadow]}>
              <View style={styles.cardContent}>
                <Image
                  source={require("../assets/images/help-illustration.png")}
                  style={styles.cardImage}
                />
                <View style={styles.cardTextWrap}>
                  <Text style={styles.cardTitle}>
                    Compassion meets innovation
                  </Text>
                  <Text style={styles.cardBody}>
                    Khuda Hafiz brings compassion and dignity to funeral
                    services through technology, supporting grieving families
                    and opening conversations around death.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        <FloatingSearchButton />
        <BottomNavBar activeTab={"Home"} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  contentContainer: { paddingBottom: 100 },
  headerSection: {
    paddingHorizontal: 20,
    paddingTop: 18,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#3c1a06",
    marginBottom: 8,
  },
  headerText: {
    textAlign: "center",
    color: "#333",
    lineHeight: 20,
    fontSize: 14,
  },
  cardSection: { paddingHorizontal: 16, marginTop: 20 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  cardShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardContent: { flexDirection: "row", alignItems: "center" },
  cardContentReverse: { flexDirection: "row-reverse" },
  cardTextWrap: { flex: 1, paddingRight: 12, paddingLeft: 12 },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#3c1a06",
    marginBottom: 6,
  },
  cardBody: { fontSize: 13, color: "#555", lineHeight: 18 },
  cardImage: { width: 86, height: 86, borderRadius: 8, resizeMode: "cover" },
});


