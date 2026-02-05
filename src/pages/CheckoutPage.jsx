import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../cart/CartContext";
import CreditCardForm from "../components/CreditCardForm";

function money(n) {
  return `$${Number(n).toFixed(2)}`;
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, totalPrice } = useCart();

  const itemSummary = useMemo(() => {
    if (items.length === 0) return "No items in cart.";
    return `${items.length} item(s) in cart`;
  }, [items]);

  return (
    <div style={{ maxWidth: 900, margin: "30px auto", padding: 16 }}>
      <h1 style={{ marginBottom: 6 }}>Checkout</h1>
      <div style={{ marginBottom: 16, opacity: 0.85 }}>
        <div>{itemSummary}</div>
        <div>Total: {money(totalPrice)}</div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <button onClick={() => navigate("/cart")} style={{ padding: "8px 12px", cursor: "pointer" }}>
          Back to Cart
        </button>
      </div>

      <CreditCardForm />
    </div>
  );
}