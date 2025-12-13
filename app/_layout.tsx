import { Stack, useSegments, useRouter } from "expo-router";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";

function AuthGuard() {
  const { isAuthenticated, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    const first = segments[0] || "";
    // only allow access to these public pages when not authenticated
    const publicPages = ["login", "signup", ""]; // root, login, signup

    if (!isAuthenticated && !publicPages.includes(first)) {
      // user not authenticated and trying to access protected page -> send to login
      router.replace("/login");
      return;
    }

    // If authenticated and on login/signup, send to home
    if (
      isAuthenticated &&
      (first === "login" || first === "signup" || first === "")
    ) {
      router.replace("/home");
      return;
    }
  }, [isAuthenticated, loading, segments.join("/")]);

  // while loading auth state, show a full-screen spinner to avoid flashing protected UI
  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return null;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthGuard />
      <Stack screenOptions={{ headerShown: false }}>
        {/* All screens will inherit headerShown: false */}
      </Stack>
    </AuthProvider>
  );
}
