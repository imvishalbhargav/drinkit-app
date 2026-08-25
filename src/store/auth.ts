import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  setUser: (u: User) => void;
  updateUser: (patch: Partial<User>) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      setUser: (u) => set({ user: u, isLoggedIn: true }),
      updateUser: (patch) =>
        set((s) => ({ user: s.user ? { ...s.user, ...patch } : s.user })),
      logout: () => set({ user: null, isLoggedIn: false }),
    }),
    { name: 'drinkit-auth' }
  )
);
