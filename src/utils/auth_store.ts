import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean;
  setIsAuthenticated: (authenticated: boolean) => void;
  authToken: string | null;
  setAuthToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: localStorage.getItem("authToken") !== null,
  authToken: localStorage.getItem("authToken"),
  setIsAuthenticated: (authenticated) => {
    set({ isAuthenticated: authenticated });
    if (!authenticated) {
      localStorage.removeItem("authToken");
    }
  },
  setAuthToken: (token) => {
    set({ authToken: token });
    if (token) {
      localStorage.setItem("authToken", token);
    }
  },
  logout: () => {
    set({ isAuthenticated: false, authToken: null });
    localStorage.removeItem("authToken");
  },
}));
