import axios from "axios";
import { API_URL } from "./config";

export type Service = {
  _id: string;
  name: string;
  price: number;
  desc?: string;
};

export type BookingData = {
  userId: string;
  packageName: string;
  items: Array<{ name: string; price: number }>;
  totalPrice: number;
};

export type BookingResponse = {
  success: boolean;
  error?: string;
  data?: any;
};

export const getServices = async (): Promise<Service[]> => {
  try {
    const res = await axios.get(`${API_URL}/services`);
    return res.data.map((item: any) => ({
      ...item,
      _id: String(item._id),
    }));
  } catch (err) {
    console.error("Error fetching services:", err);
    return [];
  }
};

export const getPackages = async (): Promise<any[]> => {
  try {
    const res = await axios.get(`${API_URL}/packages`);
    return res.data;
  } catch (err) {
    console.error("Error fetching packages:", err);
    return [];
  }
};

export const bookPackage = async (bookingData: BookingData): Promise<BookingResponse> => {
  try {
    const res = await axios.post(`${API_URL}/bookings`, bookingData);
    return { success: true, data: res.data };
  } catch (err) {
    console.error("Error booking package:", err);
    return { 
      success: false,
      error: err instanceof Error ? err.message : String(err) 
    };
  }
};
