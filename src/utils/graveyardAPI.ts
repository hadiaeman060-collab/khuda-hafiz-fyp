import axios from "axios";
import API_URL from "../../utils/config";

const BASE_URL = API_URL;

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
