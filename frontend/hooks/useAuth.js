'use client';
import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { authService } from '@/services/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('sv_user');
    const token = localStorage.getItem('sv_access_token');
    if (stored && token) {
      try {
        setUser(JSON.parse(stored));
      } catch { localStorage.removeItem('sv_user'); }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await authService.login({ email, password });
    localStorage.setItem('sv_access_token', res.data.access);
    localStorage.setItem('sv_refresh_token', res.data.refresh);
    localStorage.setItem('sv_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data;
  }, []);

  const register = useCallback(async (data) => {
    const res = await authService.register(data);
    localStorage.setItem('sv_access_token', res.data.access);
    localStorage.setItem('sv_refresh_token', res.data.refresh);
    localStorage.setItem('sv_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data;
  }, []);

  const logout = useCallback(async () => {
    const refresh = localStorage.getItem('sv_refresh_token');
    try { await authService.logout(refresh); } catch {}
    localStorage.removeItem('sv_access_token');
    localStorage.removeItem('sv_refresh_token');
    localStorage.removeItem('sv_user');
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const res = await authService.getProfile();
      localStorage.setItem('sv_user', JSON.stringify(res.data));
      setUser(res.data);
    } catch {}
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
