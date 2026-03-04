import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  View,
  
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { sendChatMessage } from "../src/utils/chatAPI";
import { router } from "expo-router";
import { useAuth } from "./context/AuthContext";

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

type Role = "user" | "model" | "system";
type Message = { id: string; role: Role; text: string };

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    { id: uid(), role: "system", text: "Assalamu Alaikum. Welcome to Khuda Hafiz.\nWe are here to support you during this difficult time and assist with respectful funeral arrangements.\nالسلام علیکم۔ خدا حافظ میں خوش آمدید۔ ہم اس مشکل وقت میں آپ کی مکمل رہنمائی کے لیے موجود ہیں۔ براہِ کرم بتائیں ہم آپ کی کس طرح مدد کر سکتے ہیں؟" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<FlatList<Message> | null>(null);
  const navigation = useNavigation<any>();
  const { user } = useAuth();

 const toHistory = (msgs: Message[]): { role: "user" | "model"; text: string }[] =>
  msgs
    .filter((m) => m.role === "user" || m.role === "model")
    .map((m) => ({ role: m.role as "user" | "model", text: m.text }));

  const onSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    const userMsg: Message = { id: uid(), role: "user", text };
    const nextMsgs = [...messages, userMsg];
    setMessages(nextMsgs);
    setLoading(true);

    try {
      const reply = await sendChatMessage(text, toHistory(messages), user?.uid);
      const botMsg: Message = { id: uid(), role: "model", text: reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch (e: unknown) {
      const errText = e instanceof Error ? e.message : String(e);
      const errMsg: Message = { id: uid(), role: "model", text: `⚠️ ${errText}` };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 50);
    }
  };

  const renderItem = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.bubble,
        item.role === "user" ? styles.userBubble : styles.botBubble,
      ]}
    >
      <Text style={styles.bubbleText}>{item.text}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace("/")}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(m) => m.id}
        contentContainerStyle={styles.list}
        renderItem={renderItem}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        ListFooterComponent={
          loading ? (
            <View style={[styles.bubble, styles.botBubble, styles.typing]}>
              <ActivityIndicator />
              <Text style={{ marginLeft: 10 }}>Thinking…</Text>
            </View>
          ) : null
        }
      />

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type your message…"
          multiline
        />
        <Pressable style={styles.sendBtn} onPress={onSend} disabled={loading}>
          <Text style={styles.sendBtnText}>Send</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },
  backBtn: { padding: 6 },
  backText: { fontSize: 16, color: "#111" },
  list: { padding: 12, paddingBottom: 8 },
  bubble: {
    maxWidth: "85%",
    padding: 12,
    borderRadius: 14,
    marginVertical: 6,
  },
  userBubble: { alignSelf: "flex-end", backgroundColor: "#DCF8C6" },
  botBubble: { alignSelf: "flex-start", backgroundColor: "#F1F1F1" },
  bubbleText: { fontSize: 16, lineHeight: 22 },
  typing: { flexDirection: "row", alignItems: "center" },
  inputRow: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#eee",
    alignItems: "flex-end",
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 130,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  sendBtn: {
    marginLeft: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#111",
  },
  sendBtnText: { color: "#fff", fontWeight: "600" },
});