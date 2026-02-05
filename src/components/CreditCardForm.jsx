import React, { useMemo, useState } from "react";

const CARD_KEY = "streamlist_saved_card_v1";

function onlyDigits(str) {
  return String(str || "").replace(/\D/g, "");
}

function formatCardNumber(value) {
  // Keep max 16 digits, then group as 4-4-4-4 with spaces.
  const digits = onlyDigits(value).slice(0, 16);
  const groups = digits.match(/.{1,4}/g) || [];
  return groups.join(" ");
}

function isFormattedCardNumber(val) {
  // Strictly enforce: 4 digits + space, repeated, ending with 4 digits.
  return /^\d{4} \d{4} \d{4} \d{4}$/.test(val);
}

function loadSavedCard() {
  try {
    const saved = localStorage.getItem(CARD_KEY);
    if (!saved) return null;
    const parsed = JSON.parse(saved);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

function saveCard(cardObj) {
  try {
    localStorage.setItem(CARD_KEY, JSON.stringify(cardObj));
  } catch {
    // ignore
  }
}

export default function CreditCardForm() {
  const saved = useMemo(() => loadSavedCard(), []);
  const [name, setName] = useState(saved?.nameOnCard || "");
  const [cardNumber, setCardNumber] = useState(saved?.cardNumber || "");
  const [exp, setExp] = useState(saved?.exp || "");
  const [zip, setZip] = useState(saved?.zip || "");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  function handleCardChange(e) {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
  }

  function handleSubmit(e) {
    e.preventDefault();
    setStatus("");
    setError("");

    if (!name.trim()) {
      setError("Name on card is required.");
      return;
    }

    if (!isFormattedCardNumber(cardNumber)) {
      setError("Card number must match: 1234 5678 9012 3456");
      return;
    }

    // Save exactly what the assignment asked for (in localStorage).
    const cardObj = {
      nameOnCard: name.trim(),
      cardNumber,
      exp: exp.trim(),
      zip: zip.trim(),
      savedAt: new Date().toISOString(),
    };

    saveCard(cardObj);
    setStatus("Card information saved to localStorage.");
  }

  return (
    <div style={{ border: "1px solid #ccc", borderRadius: 8, padding: 16 }}>
      <h2 style={{ marginTop: 0 }}>Credit Card Information</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gap: 10 }}>
          <label>
            Name on Card
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ display: "block", width: "100%", padding: 8, marginTop: 4 }}
              placeholder="Full name"
            />
          </label>

          <label>
            Card Number (format: 1234 5678 9012 3456)
            <input
              value={cardNumber}
              onChange={handleCardChange}
              style={{ display: "block", width: "100%", padding: 8, marginTop: 4 }}
              placeholder="1234 5678 9012 3456"
              inputMode="numeric"
            />
          </label>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <label>
              Expiration (MM/YY)
              <input
                value={exp}
                onChange={(e) => setExp(e.target.value)}
                style={{ display: "block", width: "100%", padding: 8, marginTop: 4 }}
                placeholder="08/29"
              />
            </label>

            <label>
              Billing ZIP
              <input
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                style={{ display: "block", width: "100%", padding: 8, marginTop: 4 }}
                placeholder="ZIP"
                inputMode="numeric"
              />
            </label>
          </div>

          <button type="submit" style={{ padding: "10px 14px", cursor: "pointer" }}>
            Save Card
          </button>

          {error ? <div style={{ color: "crimson" }}>{error}</div> : null}
          {status ? <div style={{ color: "green" }}>{status}</div> : null}
        </div>
      </form>

      <div style={{ marginTop: 12, fontSize: 13, opacity: 0.8 }}>
        For this class build, card info is stored in localStorage to meet the assignment requirement.
        In a real system, this would be handled through a payment processor and tokenization instead.
      </div>
    </div>
  );
}