import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import TopBar from "../components/TopBar";
import { Stack, useRouter } from "expo-router";
import { API_URL } from "./utils/config";

type Message = {
  sender: "user" | "bot";
  text: string;
};

export default function Chatbot() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Assalamu Alaikum! I'm your Khuda Hafiz AI assistant. How can I help you today?",
    },
  ]);
  const [inputText, setInputText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const newMessage: Message = { sender: "user", text: inputText };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInputText("");
    setLoading(true);

    try {
      // 🔹 Send message to your backend
      const response = await axios.post(`${API_URL}/chat`, { messages: updatedMessages });

      const botReply: string = response.data.reply;

      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
    } catch (error) {
      console.error("Backend error:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Sorry, something went wrong. Please try again later.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TopBar showBack onBackPress={() => router.back()} title="AI Chatbot" />
      <ScrollView
        style={styles.chatContainer}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {messages.map((msg, index) => (
          <View
            key={index}
            style={[
              styles.message,
              msg.sender === "user" ? styles.userMsg : styles.botMsg,
            ]}
          >
            <Text style={styles.msgText}>{msg.text}</Text>
          </View>
        ))}
        {loading && <ActivityIndicator size="small" color="#000" />}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  chatContainer: { flex: 1, padding: 15 },
  message: { marginVertical: 6, padding: 12, borderRadius: 10, maxWidth: "80%" },
  userMsg: { backgroundColor: "#DCF8C6", alignSelf: "flex-end" },
  botMsg: { backgroundColor: "#F0F0F0", alignSelf: "flex-start" },
  msgText: { fontSize: 16 },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
  input: { flex: 1, height: 45, borderWidth: 1, borderColor: "#ccc", borderRadius: 25, paddingHorizontal: 15 },
  sendBtn: { backgroundColor: "#e57e1eff", marginLeft: 8, paddingVertical: 10, paddingHorizontal: 18, borderRadius: 25 },
  sendText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
