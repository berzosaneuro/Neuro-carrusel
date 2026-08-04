import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { api } from '../api/client';
import type { User } from '../types';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
  retry: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = 'english_app_token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    async function ensureSession() {
      try {
        if (token) {
          const { user } = await api.me(token);
          if (!cancelled) setUser(user);
          return;
        }
        const created = await api.createAnonymousSession();
        if (cancelled) return;
        localStorage.setItem(TOKEN_KEY, created.token);
        setToken(created.token);
        setUser(created.user);
      } catch {
        if (cancelled) return;
        if (token) {
          // Stored token is invalid/expired: drop it and let the effect
          // re-run to create a fresh anonymous session.
          localStorage.removeItem(TOKEN_KEY);
          setToken(null);
        } else {
          setError('No se pudo conectar. Comprueba tu conexión e inténtalo de nuevo.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    ensureSession();
    return () => {
      cancelled = true;
    };
  }, [token, attempt]);

  async function refreshUser() {
    if (!token) return;
    const { user } = await api.me(token);
    setUser(user);
  }

  function retry() {
    setAttempt((a) => a + 1);
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, error, refreshUser, retry }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
