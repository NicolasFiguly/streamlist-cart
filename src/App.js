import React from "react";
import { CartProvider } from "./cart/CartContext";
import CartPage from "./cart/CartPage";

export default function App() {
  return (
    <CartProvider>
      <CartPage />
    </CartProvider>
  );
}