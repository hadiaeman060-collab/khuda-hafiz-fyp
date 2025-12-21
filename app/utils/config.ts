// Centralized config for app runtime values.
// Try multiple sources: process.env, Expo Constants (app config extra), then fallback.
import { Platform } from "react-native";
import Constants from "expo-constants";

function stripQuotes(v?: string | null): string | undefined {
  if (v === undefined || v === null) return undefined;
  return v.replace(/^\s*["']|["']\s*$/g, "").trim();
}

const fromProcess =
  stripQuotes((process as any)?.env?.EXPO_PUBLIC_API_URL) ||
  stripQuotes((process as any)?.env?.API_URL) ||
  stripQuotes((process as any)?.env?.REACT_APP_API_URL);

const fromExpo =
  stripQuotes((Constants.expoConfig?.extra as any)?.EXPO_PUBLIC_API_URL) ||
  stripQuotes((Constants.expoConfig?.extra as any)?.API_URL) ||
  stripQuotes((Constants.manifest?.extra as any)?.EXPO_PUBLIC_API_URL) ||
  stripQuotes((Constants.manifest?.extra as any)?.API_URL);

export const API_URL: string =
  fromProcess ||
  fromExpo ||
  (Platform.OS === "web" ? "http://localhost:3000" : "http://192.168.100.129:3000");
