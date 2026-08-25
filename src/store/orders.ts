import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Order, OrderStatus } from '../types';

interface OrdersState {
  list: Order[];
  add: (o: Order) => void;
  updateStatus: (id: string, status: OrderStatus) => void;
}

export const useOrders = create<OrdersState>()(
  persist(
    (set) => ({
      list: [],
      add: (o) => set((s) => ({ list: [o, ...s.list] })),
      updateStatus: (id, status) =>
        set((s) => ({
          list: s.list.map((o) => (o.id === id ? { ...o, status } : o)),
        })),
    }),
    { name: 'drinkit-orders' }
  )
);

export const findOrder = (list: Order[], id: string) => list.find((o) => o.id === id);
