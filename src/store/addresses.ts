import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Address } from '../types';

interface AddrState {
  list: Address[];
  selectedId: string | null;
  add: (a: Address) => void;
  update: (id: string, patch: Partial<Address>) => void;
  remove: (id: string) => void;
  select: (id: string) => void;
}

export const useAddresses = create<AddrState>()(
  persist(
    (set) => ({
      list: [],
      selectedId: null,
      add: (a) =>
        set((s) => ({ list: [a, ...s.list], selectedId: a.id })),
      update: (id, patch) =>
        set((s) => ({ list: s.list.map((a) => (a.id === id ? { ...a, ...patch } : a)) })),
      remove: (id) =>
        set((s) => {
          const list = s.list.filter((a) => a.id !== id);
          const selectedId = s.selectedId === id ? (list[0]?.id ?? null) : s.selectedId;
          return { list, selectedId };
        }),
      select: (id) => set({ selectedId: id }),
    }),
    { name: 'drinkit-addresses' }
  )
);

/** Reactive helper: resolve the selected address from list + selectedId. */
export function selectedAddress(list: Address[], selectedId: string | null): Address | null {
  if (!selectedId) return list[0] ?? null;
  return list.find((a) => a.id === selectedId) ?? list[0] ?? null;
}
