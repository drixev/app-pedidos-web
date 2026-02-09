import { AuthSession, LoginCredentials } from "@/types";
import { apiClient } from "./axiosInstance";
import { HttpStatusCode } from "axios";
import { SESSION_KEY } from "./constants/keyStorage.contants";

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthSession> {
    if (credentials.email && credentials.password.length >= 4) {

      var response = await apiClient().post('/', {
        email: credentials.email,
        password: credentials.password
      });

      if (response.status !== HttpStatusCode.Ok) {
        throw new Error("Invalid credentials");
      }

      const authData = response.data as {
        token: string;
        expiresIn: number
      }

      const session: AuthSession = {
        token: authData.token,
        user: credentials.email,
        expiresIn: (authData.expiresIn / 60),
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      return session;
    }
    throw new Error("Invalid credentials");
  },

  getSession(): AuthSession | null {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session: AuthSession = JSON.parse(raw);
    if (Date.now() > session.expiresIn) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return session;
  },

  refreshSession(): AuthSession | null {
    const session = this.getSession();
    if (!session) return null;
    session.expiresIn = session.expiresIn;
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  },

  logout() {
    localStorage.removeItem(SESSION_KEY);
  },
}