import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartEntry {
  itemId: string;
  quantity: number;
}

interface CartState {
  items: CartEntry[];
  addItem: (itemId: string, quantity?: number) => void;
  setQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clear: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (itemId, quantity = 1) => {
        const existing = get().items.find((entry) => entry.itemId === itemId);
        if (existing) {
          set({
            items: get().items.map((entry) =>
              entry.itemId === itemId
                ? { ...entry, quantity: entry.quantity + quantity }
                : entry,
            ),
          });
        } else {
          set({ items: [...get().items, { itemId, quantity }] });
        }
      },
      setQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          set({
            items: get().items.filter((entry) => entry.itemId !== itemId),
          });
        } else {
          set({
            items: get().items.map((entry) =>
              entry.itemId === itemId ? { ...entry, quantity } : entry,
            ),
          });
        }
      },
      removeItem: (itemId) => {
        set({ items: get().items.filter((entry) => entry.itemId !== itemId) });
      },
      clear: () => set({ items: [] }),
    }),
    {
      name: "sweet-salty-cart",
    },
  ),
);

export type CartItem = CartEntry;
