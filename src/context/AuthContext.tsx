import { createContext, useContext, useState, type ReactNode } from "react";
import type { AuthLoginRequest, User } from "../types";
import { loginUser as apiLoginUser } from "../api/client";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: AuthLoginRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// فك تشفير الـ JWT payload بدون تحقق (بس عشان نعرض بيانات المستخدم في الواجهة)
function decodeJwtPayload(token: string): { sub?: string; role?: string } {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return {};
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("user");
    return stored ? (JSON.parse(stored) as User) : null;
  });

  const login = async (credentials: AuthLoginRequest) => {
    if (!credentials.email || !credentials.password) {
      throw new Error("Email و Password مطلوبين");
    }

    // بينادي الباك اند الحقيقي POST /auth/login
    const tokenResponse = await apiLoginUser({
      email: credentials.email,
      password: credentials.password,
    });

    const payload = decodeJwtPayload(tokenResponse.access_token);

    const realUser: User = {
      id: payload.sub ?? "",
      email: credentials.email,
      fullName: credentials.email.split("@")[0],
      role: payload.role,
    };

    localStorage.setItem("user", JSON.stringify(realUser));
    setUser(realUser);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}