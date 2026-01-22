import React from "react";
import { useCart } from "./CartContext";
import { subscriptions, accessories } from "../Data";
import "./CartPage.css";

function money(n) {
  return `$${Number(n).toFixed(2)}`;
}

export default function CartPage() {
  const {
    items,
    totalPrice,
    warning,
    addItem, // temporary until product pages exist
    increment,
    decrement,
    removeItem,
    clearCart,
  } = useCart();

  // Temporary “test add” bar using the real Data.js arrays
  const sampleProducts = [...subscriptions, ...accessories];

  return (
    <div className="cart-page">
      <h1 className="cart-title">Shopping Cart</h1>

      {/* Temporary buttons for testing cart logic (remove later) */}
      <div className="cart-testbar">
        <span className="cart-testbar-label">Test Add:</span>
        {sampleProducts.map((p) => (
          <button key={p.id} className="btn btn-secondary" onClick={() => addItem(p)}>
            {p.name}
          </button>
        ))}
      </div>

      {warning ? <div className="cart-warning">{warning}</div> : null}

      <div className="cart-layout">
        {/* LEFT: items */}
        <section className="cart-items">
          {items.length === 0 ? (
            <div className="cart-empty">Your cart is empty.</div>
          ) : (
            items.map((it) => (
              <div className="cart-item" key={it.id}>
                <div className="cart-item-img" aria-hidden="true">
                  IMG
                </div>

                <div className="cart-item-info">
                  <div className="cart-item-name">{it.name}</div>
                  <div className="cart-item-meta">
                    <span className="cart-item-price">{money(it.price)} each</span>
                    <span className="cart-item-type">Type: {it.category}</span>
                  </div>
                </div>

                <div className="cart-item-actions">
                  <div className="qty-controls">
                    <button className="btn btn-qty" onClick={() => decrement(it.id)}>
                      -
                    </button>
                    <span className="qty-value">{it.quantity}</span>
                    <button className="btn btn-qty" onClick={() => increment(it.id)}>
                      +
                    </button>
                  </div>

                  <button className="btn btn-remove" onClick={() => removeItem(it.id)}>
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}

          <div className="cart-footer">
            <button className="btn btn-secondary" onClick={clearCart} disabled={items.length === 0}>
              Clear Cart
            </button>
            <button className="btn btn-secondary" disabled>
              Continue Shopping
            </button>
          </div>
        </section>

        {/* RIGHT: summary */}
        <aside className="cart-summary">
          <div className="summary-box">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>{money(totalPrice)}</span>
            </div>
            <div className="summary-row">
              <span>Estimated Tax</span>
              <span>$0.00</span>
            </div>
            <div className="summary-row summary-total">
              <span>Total</span>
              <span>{money(totalPrice)}</span>
            </div>

            <button className="btn btn-primary" disabled={items.length === 0}>
              Checkout
            </button>
          </div>

          <div className="coupon-box">
            <input className="coupon-input" type="text" placeholder="Coupon code (optional)" />
            <button className="btn btn-secondary" disabled>
              Apply
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}