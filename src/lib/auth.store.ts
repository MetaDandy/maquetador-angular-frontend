import { create } from "zustand";

type AuthState = {
  token: string | null;
  isHydrated: boolean;
  setToken: (token: string) => void;
  logout: () => void;
  hydrate: () => void;
};

const useAuthStore = create<AuthState>((set) => ({
  token: null,
  isHydrated: false,
  setToken: (token) => {
    localStorage.setItem('token', token);
    set({ token });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ token: null });
  },
  hydrate: () => {
    const token = localStorage.getItem("token")
    set({ token, isHydrated: true })
  }
}));

export default useAuthStore;