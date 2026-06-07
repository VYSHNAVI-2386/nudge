import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api } from "../api/client";

type User = { id: string; name: string; email: string };

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("nudge-token");
    if (token) {
      api.auth.me()
        .then(setUser)
        .catch(() => setUser(null))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const data = await api.auth.login(email, password);
    localStorage.setItem("nudge-token", data.accessToken);
    localStorage.setItem("nudge-refresh", data.refreshToken);
    setUser(data.user);
  };

  const register = async (name: string, email: string, password: string) => {
    const data = await api.auth.register(name, email, password);
    localStorage.setItem("nudge-token", data.accessToken);
    localStorage.setItem("nudge-refresh", data.refreshToken);
    setUser(data.user);
  };

  const logout = () => {
    api.auth.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
