import axios from "axios";

// ✅ Set this correctly:
// Android emulator:  http://10.0.2.2:3000
// iOS simulator:    http://localhost:3000
// Real phone:       http://YOUR_PC_LAN_IP:3000
const BASE_URL = "http://192.168.100.137:3000";

export async function getCities(): Promise<string[]> {
  const res = await axios.get(`${BASE_URL}/graveyards/cities`);
  if (!res.data?.success) throw new Error(res.data?.error || "Failed to fetch cities");
  return res.data.cities;
}

export async function getGraveyardsByCity(city: string) {
  const res = await axios.get(`${BASE_URL}/graveyards/by-city`, {
    params: { city },
  });
  if (!res.data?.success) throw new Error(res.data?.error || "Failed to fetch graveyards");
  return res.data.graveyards;
}

export async function getNearbyGraveyards(lat: number, lng: number, radius = 5000) {
  const res = await axios.get(`${BASE_URL}/graveyards/search`, {
    params: { lat, lng, radius },
  });
  if (!res.data?.success) throw new Error(res.data?.error || "Failed to fetch nearby graveyards");
  return res.data.graveyards;
}
