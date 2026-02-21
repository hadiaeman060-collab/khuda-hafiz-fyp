import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Image,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import axios from "axios";
import BottomNavBar from "../components/BottomNavBar";

export default function FeedbackScreen() {
  const router = useRouter();

  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      alert("Please select a star rating");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/feedback", // Replace with your server IP
        { rating, message }
      );

      if (response.data.success) {
        setShowModal(true);
        setRating(0);
        setMessage("");
      } else {
        alert("Failed to submit feedback");
      }
    } catch (err) {
      console.error(err);
      alert(
        "Error submitting feedback. Make sure your backend is running and reachable."
      );
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Image
              source={require("../assets/icons/back.png")}
              style={styles.backIcon}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Feedback</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title}>How Do You Like Our App?</Text>
          <Text style={styles.subtitle}>
            Please rate our funeral services and share your feedback.
          </Text>

          {/* ⭐ Star Rating */}
          <View style={styles.starRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <Text
                  style={[
                    styles.star,
                    star <= rating ? styles.starActive : styles.starInactive,
                  ]}
                >
                  ★
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Message */}
          <Text style={styles.label}>Message (Optional)</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Write your feedback"
            multiline
            value={message}
            onChangeText={setMessage}
          />

          {/* Submit */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ✅ Success Modal */}
      <Modal transparent visible={showModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeIcon}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>

            {/* Check Icon */}
            <View style={styles.checkCircle}>
              <Text style={styles.checkMark}>✓</Text>
            </View>

            <Text style={styles.modalText}>
              Feedback submitted successfully
            </Text>
          </View>
        </View>
      </Modal>

      {/* Bottom Navbar */}
      <BottomNavBar activeTab="Feedback" />
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  backIcon: { width: 24, height: 24, tintColor: "#5a3d2b" },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    color: "#5a3d2b",
  },

  content: { padding: 20 },
  title: { fontSize: 18, fontWeight: "600", marginBottom: 6 },
  subtitle: { fontSize: 14, color: "#666", marginBottom: 20 },

  starRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 25,
  },
  star: { fontSize: 36, marginHorizontal: 6 },
  starActive: { color: "#f5a623" },
  starInactive: { color: "#ccc" },

  label: { fontSize: 14, marginBottom: 6, fontWeight: "500" },
  textArea: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    height: 100,
    textAlignVertical: "top",
    marginBottom: 20,
  },

  submitButton: {
    backgroundColor: "#2b0e05",
    paddingVertical: 14,
    borderRadius: 10,
    width: 140,
  },
  submitText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },

  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    width: 260,
    height: 260,
    backgroundColor: "#fff",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  closeIcon: {
    position: "absolute",
    top: 14,
    right: 14,
    zIndex: 10,
  },

  closeText: {
    fontSize: 20,
    color: "#333",
  },

  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#2ecc71",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  checkMark: {
    color: "#fff",
    fontSize: 40,
    fontWeight: "bold",
  },

  modalText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    color: "#333",
  },
});
