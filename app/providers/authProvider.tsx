"use client";

import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { Axios } from "@/lib/axios";

type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
};

type AuthContextType = {
  auth: AuthUser | null;
  accessToken: string | null;
  setAuth: React.Dispatch<React.SetStateAction<AuthUser | null>>;
  refreshUser: () => Promise<string | null>; // 🔥 IMPORTANT FIX
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [auth, setAuth] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async (): Promise<string | null> => {
    try {
      const res = await Axios.post(
        "/auth/refresh",
        {},
        { withCredentials: true },
      );

      const token = res.data.access_token;

      const me = await Axios.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // 🔥 SINGLE STATE BATCH (important fix)
      setAccessToken(token);
      setAuth(me.data);

      return token;
    } catch (err) {
      console.error("Failed to refresh user:", err);
      setAccessToken(null);
      setAuth(null);
      return null;
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      await refreshUser();

      if (mounted) {
        setLoading(false);
      }
    };

    init();

    return () => {
      mounted = false;
    };
  }, [refreshUser]);

  const value = useMemo(
    () => ({
      auth,
      accessToken,
      setAuth,
      refreshUser,
      loading,
    }),
    [auth, accessToken, refreshUser, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
