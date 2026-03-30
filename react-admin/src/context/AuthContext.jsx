import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);
const STORAGE_KEY = "react-admin-auth";

function readStoredAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { token: "", user: null };
  } catch {
    return { token: "", user: null };
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(readStoredAuth);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
  }, [auth]);

  useEffect(() => {
    if (auth.token) {
      api.defaults.headers.common.Authorization = `Bearer ${auth.token}`;
    } else {
      delete api.defaults.headers.common.Authorization;
    }
  }, [auth.token]);

  const value = useMemo(
    () => ({
      token: auth.token,
      user: auth.user,
      isAuthenticated: Boolean(auth.token),
      login: (payload) => setAuth(payload),
      logout: () => setAuth({ token: "", user: null }),
      updateUser: (user) => setAuth((current) => ({ ...current, user }))
    }),
    [auth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
