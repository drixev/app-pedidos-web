import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { authService } from "@/services/auth.api";
import { AuthSession, LoginCredentials } from "@/types";

interface AuthContextType {
  session: AuthSession | null;
  isLoading: boolean;
  login: (creds: LoginCredentials) => Promise<void>;
  logout: () => void;
  timeRemaining: number; // seconds
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);

  const updateTimer = useCallback(() => {
    const s = authService.getSession();
    if (s) {
      const remaining = Math.max(
        0,
        Math.floor((s.expiresIn - Date.now()) / 1000),
      );
      setTimeRemaining(remaining);
      if (remaining <= 0) {
        authService.logout();
        setSession(null);
        setTimeRemaining(0);
      }
    }
  }, []);

  useEffect(() => {
    const s = authService.getSession();
    setSession(s);
    setIsLoading(false);
    if (s) updateTimer();
  }, [updateTimer]);

  useEffect(() => {
    if (session) {
      intervalRef.current = setInterval(updateTimer, 1000);
      return () => clearInterval(intervalRef.current);
    }
  }, [session, updateTimer]);

  // Refresh session on user activity
  useEffect(() => {
    if (!session) return;
    const refresh = () => {
      const refreshed = authService.refreshSession();
      if (refreshed) setSession(refreshed);
    };
    const events = ["mousedown", "keydown", "scroll", "touchstart"];
    events.forEach((e) =>
      window.addEventListener(e, refresh, { passive: true }),
    );
    return () => events.forEach((e) => window.removeEventListener(e, refresh));
  }, [session]);

  const login = async (creds: LoginCredentials) => {
    const s = await authService.login(creds);
    setSession(s);
  };

  const logout = () => {
    authService.logout();
    setSession(null);
    setTimeRemaining(0);
  };

  return (
    <AuthContext.Provider
      value={{ session, isLoading, login, logout, timeRemaining }}
    >
      {children}
    </AuthContext.Provider>
  );
};
