import { toast } from "sonner";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { BookType } from "../(public)/books/page";

interface CartProp {
  items: BookType[];
  quantity: number;
  addItem: (data: BookType) => void;
  removeItem: (id: string | number) => void;
  increaseQuantity: (data: BookType) => void;
  decreaseQuantity: (data: BookType) => void;
  removeAll: () => void;
}

const useCart = create(
  persist<CartProp>(
    (set, get) => ({
      items: [],
      quantity: 1,
      addItem: (data: BookType) => {
        const currentItem = get().items;
        let quantity = get().quantity;
        const existingItem = currentItem.find((item) => item.id === data.id);
        if (existingItem) {
          if (existingItem.quantity >= data.quantity) {
            toast.error("cannot perform operation");
            return;
          }
          quantity++;
          set({ quantity: existingItem.quantity });
          existingItem.price = Number(existingItem.price) + Number(data.price);

          set({ items: [...get().items] });
          toast.success("item added successfully to cart");
          return;
        }
        set({
          items: [
            ...get().items,
            {
              ...data,
              quantity: quantity,
              price: Number(data.price) * quantity,
            },
          ],
        });
        toast.success("item added successfully to cart");
      },
      removeItem: (id: string | number) => {
        set({ items: [...get().items].filter((item) => item.id !== id) });
        toast.success("item removed successfully from cart");
      },

      increaseQuantity: (data: BookType) => {
        let existingQuantity = get().quantity;
        const itemExists = get().items.find((item) => item.id === data.id);
        if (itemExists) {
          console.log("item exists on add ===== ", itemExists.quantity);
          console.log("data on add ===== ", data.quantity);
          if (itemExists.quantity >= data.quantity) {
            toast.error("cannot perform operation");
            return;
          }
          itemExists.quantity++;
          set({ quantity: itemExists.quantity });
          itemExists.price = Number(itemExists.price) + Number(data.price);
          set({ items: [...get().items] });
        }
        if (existingQuantity >= data.quantity) {
          toast.error("cannot perform operation");
          return;
        }
        existingQuantity++;
        set({ quantity: existingQuantity });
      },

      decreaseQuantity: (data: BookType) => {
        let existingQuantity = get().quantity;
        const itemExists = get().items.find((item) => item.id === data.id);

        if (itemExists) {
          if (itemExists.quantity === 1) {
            toast.error("cannot perform operation");
            return;
          }
          itemExists.quantity--;
          set({ quantity: itemExists.quantity });
          itemExists.price = Number(itemExists.price) - Number(data.price);
          set({ items: [...get().items] });
        }
        if (existingQuantity <= 1) {
          toast.error("cannot perform operation");
          return;
        }
        existingQuantity--;
        set({ quantity: existingQuantity });
      },

      removeAll: () => {
        set({ items: [] });
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useCart;
