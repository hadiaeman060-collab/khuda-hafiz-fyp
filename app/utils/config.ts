// Centralized config for app runtime values.
// Try multiple sources: process.env, Expo Constants (app config extra), then fallback.
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

// Backend API URL
// For local development, set EXPO_PUBLIC_API_URL in .env to your computer's IP:
//   EXPO_PUBLIC_API_URL=http://192.168.x.x:3000
const BACK4APP_API_URL = "https://khudahafizdeploy-vhj034bm.b4a.run";

export const API_URL: string = fromProcess || fromExpo || BACK4APP_API_URL;

export default function UtilsConfigRoute() {
  return null;
}
