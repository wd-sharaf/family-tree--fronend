import { createContext, useContext, useState, type ReactNode } from "react";
import type { AuthLoginRequest, User } from "../types";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: AuthLoginRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("user");
    return stored ? (JSON.parse(stored) as User) : null;
  });

  const login = async (credentials: AuthLoginRequest) => {
    // تجهيز قيم نصية مؤكدة لتفادي أخطاء TypeScript
    const email = credentials?.email || "user@example.com";
    const name = email.split("@")[0] || "User";

    const mockUser: User = {
      id: "1",
      email: email,
      name: name,
    };

    const mockToken = "mock-demo-token-12345";

    localStorage.setItem("accessToken", mockToken);
    localStorage.setItem("user", JSON.stringify(mockUser));
    setUser(mockUser);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}