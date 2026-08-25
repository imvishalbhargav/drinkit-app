import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  /** persisted: whether the 21+ age gate has been accepted */
  ageVerified: boolean;
  setAgeVerified: (v: boolean) => void;

  ageGateOpen: boolean;
  openAgeGate: () => void;
  closeAgeGate: () => void;

  /** transient overlay flags */
  cartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;

  authOpen: boolean;
  openAuth: () => void;
  closeAuth: () => void;

  locationOpen: boolean;
  openLocation: () => void;
  closeLocation: () => void;

  /** toast queue */
  toast: string | null;
  showToast: (msg: string) => void;
  clearToast: () => void;
}

export const useUI = create<UIState>()(
  persist(
    (set) => ({
      ageVerified: false,
      setAgeVerified: (v) => set({ ageVerified: v }),

      ageGateOpen: false,
      openAgeGate: () => set({ ageGateOpen: true }),
      closeAgeGate: () => set({ ageGateOpen: false }),

      cartOpen: false,
      openCart: () => set({ cartOpen: true }),
      closeCart: () => set({ cartOpen: false }),

      authOpen: false,
      openAuth: () => set({ authOpen: true }),
      closeAuth: () => set({ authOpen: false }),

      locationOpen: false,
      openLocation: () => set({ locationOpen: true }),
      closeLocation: () => set({ locationOpen: false }),

      toast: null,
      showToast: (msg) => set({ toast: msg }),
      clearToast: () => set({ toast: null }),
    }),
    { name: 'drinkit-ui', partialize: (s) => ({ ageVerified: s.ageVerified }) }
  )
);
