import { AuthSession, LoginCredentials } from "@/types";

const SESSION_KEY = "dev_crud_session";
const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes

export const authService = {
      async login(credentials: LoginCredentials): Promise<AuthSession> {
        if (credentials.email && credentials.password.length >= 4) {

          const session: AuthSession = {
            token: `tok_${crypto.randomUUID()}`,
            user: { id: crypto.randomUUID(), email: credentials.email, name: credentials.email.split("@")[0] },
            expiresIn: Date.now() + SESSION_DURATION,
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
        session.expiresIn = Date.now() + SESSION_DURATION;
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        return session;
      },
    
      logout() {
        localStorage.removeItem(SESSION_KEY);
      },
}