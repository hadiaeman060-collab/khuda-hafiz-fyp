import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  getToken,
  saveToken,
  clearTokens,
  logout as backendLogout,
} from "../utils/auth";

const BACKEND_URL = "http://192.168.18.23:3000"; // update for your dev machine

type User = { uid?: string; email?: string; displayName?: string } | null;

type AuthContextType = {
  isAuthenticated: boolean;
  loading: boolean;
  user: User;
  signIn: (tokenObj: any, profile?: any) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    async function init() {
      try {
        const idToken = await getToken("idToken");
        const profile = await getToken("profile");
        if (idToken) {
          setAuthenticated(true);
          setUser(profile ? JSON.parse(profile) : null);
        } else {
          setAuthenticated(false);
        }
      } catch (e) {
        console.warn("Auth init failed", e);
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  async function signIn(tokenObj: any, profile?: any) {
    try {
      if (tokenObj?.idToken) {
        await saveToken("idToken", tokenObj.idToken);
      }
      if (tokenObj?.refreshToken) {
        await saveToken("refreshToken", tokenObj.refreshToken);
      }
      if (profile) {
        await saveToken("profile", JSON.stringify(profile));
        setUser(profile);
      }
      setAuthenticated(true);
    } catch (e) {
      console.warn("signIn save failed", e);
      throw e;
    }
  }

  async function signOut() {
    try {
      // Use the centralized logout helper which attempts server revoke then clears storage
      try {
        await backendLogout();
      } catch (e) {
        console.warn(
          "Server logout failed",
          e?.response?.data || e.message || e
        );
      }

      await clearTokens();
      setUser(null);
      setAuthenticated(false);
    } catch (e) {
      console.warn("signOut failed", e);
      throw e;
    }
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, loading, user, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export default AuthContext;
