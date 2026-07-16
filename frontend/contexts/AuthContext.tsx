'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'Super Admin' | 'NGO Admin' | 'Volunteer' | 'Donor';
  ngo_id: string | null;
  avatar_url: string | null;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // On mount, restore session from cookie-backed token
  useEffect(() => {
    const token = getCookie('il_access_token');
    if (token) {
      fetch('/api/auth/session', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (data?.success && data.data?.user) {
            setUser(data.data.user);
          } else {
            clearSession();
          }
        })
        .catch(() => clearSession())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Login failed');
    }
    setSession(data.data.access_token, data.data.expires_at);
    setUser(data.data.user);
  }, []);

  const register = useCallback(async (email: string, password: string, name: string, role: string) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name, role }),
    });
    const data = await res.json();
    if (!data.ok && !data.success) {
      throw new Error(data.error || 'Registration failed');
    }
    if (!data.data?.access_token) {
      throw new Error('Registration successful! Please check your email to verify your account before signing in.');
    }
    setSession(data.data.access_token, data.data.expires_at);
    setUser(data.data.user);
  }, []);

  const logout = useCallback(async () => {
    const token = getCookie('il_access_token');
    if (token) {
      fetch('/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
    clearSession();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

// ─── Helpers ──────────────────────────────────────────────────
function setSession(token: string, expiresAt: number) {
  const expires = new Date(expiresAt).toUTCString();
  document.cookie = `il_access_token=${token}; path=/; expires=${expires}; SameSite=Lax`;
}

function clearSession() {
  document.cookie = 'il_access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}
