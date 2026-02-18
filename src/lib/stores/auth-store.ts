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
  accessToken: string | null;
  refreshToken: string | null;
  setAuth: (user: AuthUser, accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      setAuth: (user, accessToken, refreshToken) => {
        document.cookie = `tavuel_admin_token=${accessToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
        set({ user, accessToken, refreshToken });
      },
      logout: () => {
        document.cookie =
          "tavuel_admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        set({ user: null, accessToken: null, refreshToken: null });
      },
    }),
    { name: "tavuel-admin-auth" }
  )
);
