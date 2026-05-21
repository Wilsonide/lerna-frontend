"use client";

import { useSelector } from "react-redux";
import { RootState } from "../../features/store";

import CartItem from "@/components/home/cart-item";
import CartSummary from "@/components/home/cart-summary";

export default function CartPage() {
  const items = useSelector((state: RootState) => state.cart.items);

  return (
    <div className="container mx-auto py-12">
      <h1 className="mb-10 text-5xl font-bold">Shopping Cart</h1>

      <div className="grid gap-10 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {items.length === 0 ? (
            <p className="text-slate-500">Cart is empty</p>
          ) : (
            items.map((item) => <CartItem key={item.id} item={item} />)
          )}
        </div>

        <CartSummary />
      </div>
    </div>
  );
}
