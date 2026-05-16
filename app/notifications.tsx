import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { AppNotification, useNotifications } from "./context/NotificationContext";

function NotificationItem({ item }: { item: AppNotification }) {
  // use the app brown color for all notification icons
  const iconColor = "#3c1a06";
  const iconName =
    item.type === "success"
      ? "checkmark"
      : item.type === "info"
      ? "notifications-outline"
      : "chatbubble-ellipses-outline";

  const date = useMemo(() => {
    try {
      return new Date(item.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "";
    }
  }, [item.createdAt]);

  return (
    <TouchableOpacity activeOpacity={0.9} style={styles.cardContainer}>
      <View style={styles.cardRow}>
        <View style={[styles.iconWrap, { backgroundColor: iconColor + "22" }]}>
          <View style={[styles.iconCircle, { backgroundColor: iconColor }]}>
            <Ionicons name={iconName as any} size={16} color="#fff" />
          </View>
        </View>

        <View style={styles.cardBody}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDate}>{date}</Text>
          </View>
          <Text style={styles.cardText}>{item.text}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function Notifications() {
  const router = useRouter();
  const { notifications, markAllAsRead } = useNotifications();

  useFocusEffect(
    React.useCallback(() => {
      markAllAsRead();
    }, [markAllAsRead])
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color="#3c1a06" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Previously</Text>

        {notifications.length === 0 ? (
          <Text style={styles.emptyText}>No notifications yet.</Text>
        ) : (
          notifications.map((d) => <NotificationItem key={d.id} item={d} />)
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff8ef" },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
    color: "#3c1a06",
  },

  content: { padding: 16 },

  cardContainer: {
    marginBottom: 12,
    borderRadius: 18,
    backgroundColor: "#fff",
    // shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    padding: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 12,
    color: "#111",
  },
  emptyText: {
    color: "#666",
    fontSize: 14,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  cardRow: { flexDirection: "row", alignItems: "flex-start" },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  cardBody: { flex: 1 },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: { fontSize: 14, fontWeight: "600", color: "#111" },
  cardDate: { fontSize: 12, color: "#777" },
  cardText: { marginTop: 6, color: "#555", fontSize: 13 },
});
