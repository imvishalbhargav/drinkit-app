import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartLine } from '../types';
import { getProduct } from '../data/catalog';
import { DELIVERY_FEE, FREE_DELIVERY_ABOVE, HANDLING_FEE } from '../lib/config';

interface CartState {
  items: Record<string, number>; // productId -> qty
  add: (id: string) => void;
  inc: (id: string) => void;
  dec: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: {},
      add: (id) => set((s) => ({ items: { ...s.items, [id]: (s.items[id] || 0) + 1 } })),
      inc: (id) => set((s) => ({ items: { ...s.items, [id]: (s.items[id] || 0) + 1 } })),
      dec: (id) =>
        set((s) => {
          const q = (s.items[id] || 0) - 1;
          const next = { ...s.items };
          if (q <= 0) delete next[id];
          else next[id] = q;
          return { items: next };
        }),
      remove: (id) =>
        set((s) => {
          const next = { ...s.items };
          delete next[id];
          return { items: next };
        }),
      clear: () => set({ items: {} }),
    }),
    { name: 'drinkit-cart' }
  )
);

/* ---- pure derived helpers (call with the reactive `items` slice) ---- */

export function cartLines(items: Record<string, number>): CartLine[] {
  return Object.entries(items)
    .map(([id, qty]) => {
      const p = getProduct(id);
      return p ? { ...p, qty } : null;
    })
    .filter((x): x is CartLine => x !== null);
}

export function cartCount(items: Record<string, number>): number {
  return Object.values(items).reduce((s, q) => s + q, 0);
}

export function cartTotals(items: Record<string, number>) {
  const lines = cartLines(items);
  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const subtotalMrp = lines.reduce((s, l) => s + l.mrp * l.qty, 0);
  const savings = subtotalMrp - subtotal;
  const count = lines.reduce((s, l) => s + l.qty, 0);
  const deliveryFee = count === 0 || subtotal >= FREE_DELIVERY_ABOVE ? 0 : DELIVERY_FEE;
  const handling = count === 0 ? 0 : HANDLING_FEE;
  const total = subtotal + deliveryFee + handling;
  return { lines, count, subtotal, subtotalMrp, savings, deliveryFee, handling, total };
}
