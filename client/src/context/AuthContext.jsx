import { createContext, useContext, useMemo, useState } from "react";
import http from "../api/http";

const AuthContext = createContext(null);

const readUser = () => {
  try {
    return JSON.parse(localStorage.getItem("rental_user"));
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readUser);
  const [token, setToken] = useState(localStorage.getItem("rental_token"));

  const persistSession = ({ user: nextUser, token: nextToken }) => {
    localStorage.setItem("rental_user", JSON.stringify(nextUser));
    localStorage.setItem("rental_token", nextToken);
    setUser(nextUser);
    setToken(nextToken);
  };

  const signup = async (payload) => {
    const { data } = await http.post("/auth/signup", payload);
    persistSession(data);
    return data;
  };

  const login = async (payload, admin = false) => {
    const { data } = await http.post(admin ? "/auth/admin/login" : "/auth/login", payload);
    persistSession(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("rental_user");
    localStorage.removeItem("rental_token");
    setUser(null);
    setToken(null);
  };

  const value = useMemo(
    () => ({ user, token, isAuthenticated: Boolean(token), signup, login, logout }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
