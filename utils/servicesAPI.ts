import axios from "axios";

const BASE_URL = "http://192.168.100.129:3000"; // replace with your backend IP or localhost

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
    const res = await axios.get(`${BASE_URL}/services`);
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
    const res = await axios.get(`${BASE_URL}/packages`);
    return res.data;
  } catch (err) {
    console.error("Error fetching packages:", err);
    return [];
  }
};

export const bookPackage = async (bookingData: BookingData): Promise<BookingResponse> => {
  try {
    const res = await axios.post(`${BASE_URL}/bookings`, bookingData);
    return { success: true, data: res.data };
  } catch (err) {
    console.error("Error booking package:", err);
    return { 
      success: false,
      error: err instanceof Error ? err.message : String(err) 
    };
  }
};
