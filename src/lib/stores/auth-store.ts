import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  role: string;
  avatarUrl?: string | null;
}

interface AuthState {
  user: AuthUser | null;
  setAuth: (user: AuthUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setAuth: (user) => {
        set({ user });
      },
      logout: () => {
        set({ user: null });
        if (typeof document !== "undefined") {
          document.cookie = "tavuel_session=; path=/; max-age=0";
        }
      },
    }),
    {
      name: "tavuel-admin-auth",
    }
  )
);
