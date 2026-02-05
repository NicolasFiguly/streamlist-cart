import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/cart";

  function handleLogin() {
    // For this assignment: simulate successful OAuth verification.
    // Later: replace this with real Google OAuth sign-in.
    login();
    navigate(from, { replace: true });
  }

  return (
    <div style={{ maxWidth: 720, margin: "40px auto", padding: 16 }}>
      <h1 style={{ marginBottom: 8 }}>Login</h1>
      <p style={{ marginTop: 0 }}>
        This page represents the OAuth login step. If you try to access the system
        without signing in, the app redirects you here.
      </p>

      <button onClick={handleLogin} style={{ padding: "10px 14px", cursor: "pointer" }}>
        Sign in with Google
      </button>

      <div style={{ marginTop: 18, fontSize: 14, opacity: 0.8 }}>
        Note: For the class demo, this button simulates verification so the redirect
        flow can be shown clearly.
      </div>
    </div>
  );
}