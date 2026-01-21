import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);

const STORAGE_KEY = "streamlist_cart_v1";

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveToStorage(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore storage errors (quota, disabled storage, etc.)
  }
}

// Cart item shape stored in state:
// { id, name, price, category, quantity }
export function CartProvider({ children }) {
  const [items, setItems] = useState(() => loadFromStorage());
  const [warning, setWarning] = useState("");

  useEffect(() => {
    saveToStorage(items);
  }, [items]);

  const itemCount = useMemo(
    () => items.reduce((sum, it) => sum + (it.quantity || 0), 0),
    [items]
  );

  const totalPrice = useMemo(
    () => items.reduce((sum, it) => sum + it.price * it.quantity, 0),
    [items]
  );

  function clearWarningSoon() {
    window.clearTimeout(clearWarningSoon._t);
    clearWarningSoon._t = window.setTimeout(() => setWarning(""), 2500);
  }

  function hasSubscription(cartItems) {
    return cartItems.some((it) => it.category === "subscription");
  }

  function addItem(product) {
    // product: { id, name, price, category }
    if (!product?.id) return;

    setItems((prev) => {
      // Enforce: only ONE subscription total in cart
      if (product.category === "subscription") {
        const alreadyHasSub = hasSubscription(prev);
        if (alreadyHasSub) {
          setWarning("Only one subscription can be added at a time.");
          clearWarningSoon();
          return prev;
        }
      }

      const existing = prev.find((it) => it.id === product.id);
      if (existing) {
        return prev.map((it) =>
          it.id === product.id ? { ...it, quantity: it.quantity + 1 } : it
        );
      }

      return [
        ...prev,
        {
          id: product.id,
          name: product.name || "Item",
          price: Number(product.price) || 0,
          category: product.category || "accessory",
          quantity: 1,
        },
      ];
    });
  }

  function removeItem(id) {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }

  function increment(id) {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, quantity: it.quantity + 1 } : it))
    );
  }

  function decrement(id) {
    setItems((prev) =>
      prev
        .map((it) =>
          it.id === id ? { ...it, quantity: Math.max(0, it.quantity - 1) } : it
        )
        .filter((it) => it.quantity > 0)
    );
  }

  function clearCart() {
    setItems([]);
    setWarning("");
  }

  const value = {
    items,
    itemCount,
    totalPrice,
    warning,
    addItem,
    removeItem,
    increment,
    decrement,
    clearCart,
    setWarning,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}