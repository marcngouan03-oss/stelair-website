import { createContext, useContext, useState, useCallback } from "react";
import api from "../api/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    const stored = localStorage.getItem("stelair_admin_info");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("stelair_admin_token", data.token);
      localStorage.setItem(
        "stelair_admin_info",
        JSON.stringify({ email: data.email, name: data.name })
      );
      setAdmin({ email: data.email, name: data.name });
      return true;
    } catch (err) {
      setError(err?.response?.data?.message || "Connexion impossible.");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("stelair_admin_token");
    localStorage.removeItem("stelair_admin_info");
    setAdmin(null);
  }, []);

  const isAuthenticated = !!admin && !!localStorage.getItem("stelair_admin_token");

  return (
    <AuthContext.Provider value={{ admin, login, logout, loading, error, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
