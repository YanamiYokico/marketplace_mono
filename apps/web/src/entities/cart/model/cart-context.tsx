"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useSession } from "@/entities/session";
import {
  addCartItem,
  clearCartItems,
  fetchCart,
  removeCartItem,
  updateCartItem,
} from "../api/cart-api";
import type { Cart, CartItem } from "./types";

type CartContextValue = {
  items: CartItem[];
  totalCount: number;
  totalPrice: number;
  isLoading: boolean;
  isMutating: boolean;
  error: string | null;
  isAuthenticated: boolean;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refresh: () => Promise<void>;
};

export const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { token, hydrated } = useSession();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) {
      setItems([]);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const cart = await fetchCart(token);
      setItems(cart.items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load cart");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  // Load the cart once the session is hydrated, and reload on login/logout.
  useEffect(() => {
    if (!hydrated) return;
    void load();
  }, [hydrated, load]);

  const runMutation = useCallback(
    async (fn: (token: string) => Promise<Cart>) => {
      if (!token) {
        setError("Please sign in to use the cart");
        return;
      }
      setIsMutating(true);
      setError(null);
      try {
        const cart = await fn(token);
        setItems(cart.items);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Cart update failed");
      } finally {
        setIsMutating(false);
      }
    },
    [token],
  );

  const addItem = useCallback(
    (productId: string, quantity = 1) =>
      runMutation((t) => addCartItem(t, productId, quantity)),
    [runMutation],
  );

  const updateQuantity = useCallback(
    (itemId: string, quantity: number) =>
      runMutation((t) => updateCartItem(t, itemId, quantity)),
    [runMutation],
  );

  const removeItem = useCallback(
    (itemId: string) => runMutation((t) => removeCartItem(t, itemId)),
    [runMutation],
  );

  const clearCart = useCallback(
    () => runMutation((t) => clearCartItems(t)),
    [runMutation],
  );

  const totalCount = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items],
  );

  const totalPrice = useMemo(
    () => items.reduce((sum, i) => sum + Number(i.product.price) * i.quantity, 0),
    [items],
  );

  return (
    <CartContext.Provider
      value={{
        items,
        totalCount,
        totalPrice,
        isLoading,
        isMutating,
        error,
        isAuthenticated: !!token,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        refresh: load,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
