import { createContext, useCallback, useContext, useMemo, useState } from "react";

const KEY = "sc_admin_user";
const AuthContext = createContext(null);

function readUser() {
  try {
    return sessionStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [adminName, setAdminName] = useState(readUser);

  const login = useCallback((name) => {
    try {
      sessionStorage.setItem(KEY, name);
    } catch {
      /* ignore: stays in memory only */
    }
    setAdminName(name);
  }, []);

  const logout = useCallback(() => {
    try {
      sessionStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
    setAdminName(null);
  }, []);

  const value = useMemo(
    () => ({ adminName, isAuthenticated: Boolean(adminName), login, logout }),
    [adminName, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}