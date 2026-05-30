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

const envUrl = fromProcess || fromExpo;

// Backend API URL
// For local development, set EXPO_PUBLIC_API_URL in .env to your computer's IP:
//   EXPO_PUBLIC_API_URL=http://192.168.x.x:3000
// TODO: Replace with your actual Back4app URL after first deploy
// Format will be: https://YOUR-APP-NAME.b4a.run
const BACK4APP_API_URL = "https://REPLACE_WITH_BACK4APP_URL.b4a.run";

export const API_URL: string = envUrl || BACK4APP_API_URL;

export default API_URL;
