import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { API_URL } from './config';

const BACKEND_URL = API_URL; // configured via `.env` or fallback in `config.ts`

// Safe storage wrappers: prefer SecureStore, fall back to localStorage (web)
const hasSecureStore = !!(SecureStore && (SecureStore as any).setItemAsync);

async function safeSet(key: string, value: string) {
  if (hasSecureStore) {
    return (SecureStore as any).setItemAsync(key, value);
  }
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(key, value);
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  }
  return Promise.reject(new Error('No secure storage available'));
}

async function safeGet(key: string) {
  if (hasSecureStore) {
    return (SecureStore as any).getItemAsync(key);
  }
  if (typeof window !== 'undefined' && window.localStorage) {
    return Promise.resolve(window.localStorage.getItem(key));
  }
  return Promise.resolve(null);
}

async function safeDelete(key: string) {
  if (hasSecureStore) {
    return (SecureStore as any).deleteItemAsync(key);
  }
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.removeItem(key);
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  }
  return Promise.reject(new Error('No secure storage available'));
}

export async function saveToken(key: string, value: string) {
  try {
    await safeSet(key, value);
  } catch (e) {
    console.warn('SecureStore set failed', e);
  }
}

export async function getToken(key: string) {
  try {
    return await safeGet(key);
  } catch (e) {
    console.warn('SecureStore get failed', e);
    return null;
  }
}

export async function clearTokens() {
  try {
    await safeDelete('idToken');
    await safeDelete('refreshToken');
    await safeDelete('profile');
  } catch (e) {
    console.warn('SecureStore clear failed', e);
  }
}

// Call backend to revoke tokens then clear local tokens
export async function logout(): Promise<{ ok: boolean; message?: string; error?: any }> {
  try {
    const idToken = await getToken('idToken');
    if (!idToken) {
      await clearTokens();
      return { ok: true, message: 'No idToken present; local tokens cleared' };
    }

    await axios.post(`${BACKEND_URL}/logout`, null, {
      headers: { Authorization: `Bearer ${idToken}` },
    });

    await clearTokens();
    return { ok: true, message: 'Logout succeeded' };
  } catch (err) {
    console.warn('Logout request failed', err?.response?.data || err.message || err);
    // Clear local tokens even if backend call failed to ensure user is logged out locally
    await clearTokens();
    return { ok: false, error: err?.response?.data || err.message || err };
  }
}

export default { saveToken, getToken, clearTokens, logout };
