import { Platform } from "react-native";
import Constants from "expo-constants";

function stripQuotes(v?: string | null): string | undefined {
  if (v === undefined || v === null) return undefined;
  return String(v).replace(/^\s*"|"\s*$|^\s*'|'\s*$/g, "");
}

const fromProcess =
  stripQuotes((process as any)?.env?.EXPO_PUBLIC_API_URL) ||
  stripQuotes((process as any)?.env?.API_URL) ||
  stripQuotes((process as any)?.env?.REACT_APP_API_URL);

const fromExpo =
  stripQuotes((Constants?.expoConfig?.extra as any)?.EXPO_PUBLIC_API_URL) ||
  stripQuotes((Constants?.expoConfig?.extra as any)?.API_URL) ||
  stripQuotes((Constants?.manifest?.extra as any)?.EXPO_PUBLIC_API_URL) ||
  stripQuotes((Constants?.manifest?.extra as any)?.API_URL);

function isLocal(url?: string): boolean {
  if (!url) return false;
  try {
    const host = new URL(url).hostname;
    return host === "localhost" || host === "127.0.0.1";
  } catch {
    // If not a full URL, do a simple check
    return /localhost|127\.0\.0\.1/.test(url);
  }
}

const envUrl = fromProcess || fromExpo;

export const API_URL: string = (() => {
  if (Platform.OS === "web") {
    return isLocal(envUrl) ? envUrl! : "http://localhost:3000";
  }
  return envUrl || "http://192.168.100.129:3000";
})();