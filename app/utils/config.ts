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
  (Constants.expoConfig?.extra as any)?.EXPO_PUBLIC_API_URL ||
  (process?.env as any)?.EXPO_PUBLIC_API_URL;

// On web, prefer localhost for development unless EXPO_PUBLIC_API_URL explicitly points to localhost.
function expoUrlIsLocal(url?: string) {
  if (!url) return false;
  return /localhost|127\.0\.0\.1/.test(url);
}

export const API_URL: string = ((): string => {
  if (Platform.OS === "web") {
    return expoUrlIsLocal(fromExpo) ? fromExpo! : "http://localhost:3000";
  }
  return fromExpo || "http://10.120.133.52:3000";
})();

export default function UtilsConfigRoute() {
  return null;
}
