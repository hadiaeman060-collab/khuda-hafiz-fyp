import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

const reasons = [
  "I am no longer using my account",
  "The service is too expensive",
  "I want to change my phone number",
  "I don't understand how to use",
  "Khuda Hafiz is not available in my city",
  "Other",
];

export default function DeleteProfile() {
  const [selected, setSelected] = useState<number | null>(null);
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Delete Profile</Text>
        <Text style={styles.subtitle}>
          We are really sorry to see you go. Are you sure you want to delete
          your account? Once you confirm, your data will be gone.
        </Text>

        <View style={styles.options}>
          {reasons.map((r, i) => (
            <Pressable
              key={r}
              style={styles.optionRow}
              onPress={() => setSelected(i)}
            >
              <View style={styles.radioOuter}>
                {selected === i && <View style={styles.radioInner} />}
              </View>
              <Text style={styles.optionLabel}>{r}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.footer}>
          <Pressable
            style={styles.nextButton}
            onPress={() => {
              console.log("Delete reason:", selected, reasons[selected ?? 0]);
              // placeholder: perform deletion flow or navigate
              router.push("/" as any);
            }}
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff8ef" },
  // increase top spacing so the content sits lower on the screen
  content: { padding: 20, paddingTop: 40 },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#3c1a06",
    marginBottom: 6,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 13,
    color: "#777",
    marginBottom: 18,
    textAlign: "center",
  },
  options: { marginTop: 6 },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "#333",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#333",
  },
  optionLabel: { fontSize: 14, color: "#222" },
  footer: { marginTop: 24, alignItems: "flex-end" },
  nextButton: {
    backgroundColor: "#d9534f",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  nextButtonText: { color: "#fff", fontWeight: "600" },
});
