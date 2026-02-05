import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

const AUTH_KEY = "streamlist_auth_v1";

function loadAuthFlag() {
  try {
    return localStorage.getItem(AUTH_KEY) === "true";
  } catch {
    return false;
  }
}

function saveAuthFlag(val) {
  try {
    localStorage.setItem(AUTH_KEY, val ? "true" : "false");
  } catch {
    // ignore
  }
}

export function AuthProvider({ children }) {
  const [isAuthed, setIsAuthed] = useState(() => loadAuthFlag());

  useEffect(() => {
    saveAuthFlag(isAuthed);
  }, [isAuthed]);

  function login() {
    setIsAuthed(true);
  }

  function logout() {
    setIsAuthed(false);
  }

  const value = { isAuthed, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}