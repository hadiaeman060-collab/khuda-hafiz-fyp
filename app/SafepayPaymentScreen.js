import React, { useState, useEffect, useRef } from "react";
import {
  View, Text, StyleSheet, ActivityIndicator, Alert,
  TouchableOpacity, SafeAreaView, StatusBar, Platform, Linking,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { WebView } from "react-native-webview";
import API_URL from "../utils/config";

const SafepayPaymentScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const bookingId = typeof params.bookingId === "string" ? params.bookingId : "";
  const amount = Number(params.amount || 0);

  const [loading, setLoading] = useState(true);
  const [checkoutUrl, setCheckoutUrl] = useState(null);
  const [error, setError] = useState(null);
  const [paymentDone, setPaymentDone] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const webviewRef = useRef(null);
  const pollingRef = useRef(null);

  const goBackOrFallback = () => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace("/home");
  };

  useEffect(() => {
    initiatePayment();
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  const initiatePayment = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/safepay/initiate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to start payment");
      if (!data.checkoutUrl) throw new Error("No checkout URL returned");
      setCheckoutUrl(data.checkoutUrl);
      startPolling(bookingId);
      setLoading(false);
    } catch (err) {
      setError(err.message || "Something went wrong.");
      setLoading(false);
    }
  };

  const startPolling = (bId) => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    let attempts = 0;
    pollingRef.current = setInterval(async () => {
      attempts++;
      if (attempts > 100) { clearInterval(pollingRef.current); return; }
      try {
        const resp = await fetch(`${API_URL}/safepay/status/${bId}`);
        const statusData = await resp.json();
        if (statusData.paymentStatus === "paid") {
          clearInterval(pollingRef.current);
          setPaymentDone(true);
          setPaymentSuccess(true);
        } else if (statusData.paymentStatus === "failed") {
          clearInterval(pollingRef.current);
          setPaymentDone(true);
          setPaymentSuccess(false);
        }
      } catch (e) { /* silent retry */ }
    }, 3000);
  };

  const handleNavigationChange = (navState) => {
    const { url } = navState;
    if (!url) return;
    if (url.includes("/external/complete") || url.includes("status=success")) {
      setTimeout(() => { setPaymentDone(true); setPaymentSuccess(true); }, 1500);
    } else if (url.includes("/external/error") || url.includes("status=cancelled") || url.includes("status=failed")) {
      setPaymentDone(true);
      setPaymentSuccess(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <StatusBar barStyle="dark-content" />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={styles.loadingText}>Preparing payment...</Text>
          <Text style={styles.subText}>Rs {amount?.toLocaleString() || "0"}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (paymentDone) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <StatusBar barStyle="dark-content" />
        <View style={styles.centered}>
          <Text style={{ fontSize: 72, marginBottom: 20 }}>{paymentSuccess ? "✅" : "❌"}</Text>
          <Text style={[styles.title, { color: paymentSuccess ? "#16a34a" : "#dc2626" }]}>
            {paymentSuccess ? "Payment Successful!" : "Payment Failed"}
          </Text>
          <Text style={styles.subText}>
            {paymentSuccess
              ? `Rs ${amount?.toLocaleString() || "0"} paid. Booking confirmed.`
              : "Payment was not completed. Try again or use Cash on Delivery."}
          </Text>
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: paymentSuccess ? "#16a34a" : "#6366f1" }]}
            onPress={() => {
              if (pollingRef.current) clearInterval(pollingRef.current);
              paymentSuccess ? router.replace("/order-confirmation") : goBackOrFallback();
            }}
          >
            <Text style={styles.btnText}>{paymentSuccess ? "View Booking" : "Go Back"}</Text>
          </TouchableOpacity>
          {!paymentSuccess && (
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: "#f3f4f6", marginTop: 12 }]}
              onPress={() => { setPaymentDone(false); setCheckoutUrl(null); initiatePayment(); }}
            >
              <Text style={[styles.btnText, { color: "#374151" }]}>Try Again</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    );
  }

  if (error && !checkoutUrl) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.centered}>
          <Text style={{ fontSize: 72, marginBottom: 20 }}>⚠️</Text>
          <Text style={[styles.subText, { color: "#dc2626" }]}>{error}</Text>
          <TouchableOpacity style={[styles.btn, { backgroundColor: "#6366f1" }]} onPress={() => { setError(null); initiatePayment(); }}>
            <Text style={styles.btnText}>Retry</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, { backgroundColor: "#f3f4f6", marginTop: 12 }]} onPress={goBackOrFallback}>
            <Text style={[styles.btnText, { color: "#374151" }]}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (Platform.OS === "web") {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <StatusBar barStyle="dark-content" />
        <View style={styles.header}>
          <TouchableOpacity onPress={goBackOrFallback}>
            <Text style={{ fontSize: 16, color: "#dc2626", fontWeight: "500" }}>✕ Cancel</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 16, fontWeight: "600", color: "#1f2937" }}>Secure Payment</Text>
          <Text style={{ fontSize: 16, fontWeight: "700", color: "#16a34a" }}>Rs {amount?.toLocaleString() || "0"}</Text>
        </View>
        <View style={styles.webFrameWrap}>
          <iframe
            src={checkoutUrl}
            title="Safepay checkout"
            style={styles.webFrame}
          />
        </View>
        <TouchableOpacity
          style={[styles.btn, styles.webOpenBtn]}
          onPress={() => Linking.openURL(checkoutUrl)}
        >
          <Text style={styles.btnText}>Open Payment</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {
          Alert.alert("Cancel Payment?", "Are you sure?", [
            { text: "No", style: "cancel" },
            { text: "Yes", style: "destructive", onPress: goBackOrFallback },
          ]);
        }}>
          <Text style={{ fontSize: 16, color: "#dc2626", fontWeight: "500" }}>✕ Cancel</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 16, fontWeight: "600", color: "#1f2937" }}>Secure Payment</Text>
        <Text style={{ fontSize: 16, fontWeight: "700", color: "#16a34a" }}>Rs {amount?.toLocaleString() || "0"}</Text>
      </View>
      <WebView
        ref={webviewRef}
        source={{ uri: checkoutUrl }}
        onNavigationStateChange={handleNavigationChange}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.centered}><ActivityIndicator size="large" color="#6366f1" /></View>
        )}
        style={{ flex: 1 }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", padding: 32 },
  loadingText: { marginTop: 16, fontSize: 18, fontWeight: "600", color: "#1f2937" },
  subText: { marginTop: 8, fontSize: 14, color: "#6b7280", textAlign: "center", lineHeight: 22, marginBottom: 24 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 12 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#e5e7eb" },
  btn: { paddingVertical: 14, paddingHorizontal: 40, borderRadius: 12, minWidth: 200, alignItems: "center" },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  webFrameWrap: { flex: 1 },
  webFrame: { width: "100%", height: "100%", borderWidth: 0 },
  webOpenBtn: { backgroundColor: "#6366f1", alignSelf: "center", margin: 16 },
});

export default SafepayPaymentScreen;
