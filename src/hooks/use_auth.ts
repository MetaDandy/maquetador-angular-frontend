'use client';

import useAuthStore from "@/lib/auth.store";
import { useEffect, useState } from "react";

export function useAuth() {
  const { token, setToken, logout, hydrate, isHydrated } = useAuthStore();
  const [hydrated, setHydrated] = useState(isHydrated);

  useEffect(() => {
    if (!isHydrated) {
      hydrate();
      setHydrated(true);
    }
  }, [isHydrated]);

  const isAuthenticated = () => !!token;

  return {
    token,
    setToken,
    logout,
    isAuthenticated,
    isHydrated: hydrated,
  }
}