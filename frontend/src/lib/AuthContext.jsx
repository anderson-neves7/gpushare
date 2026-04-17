// src/lib/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from './api';

const AuthContext = createContext(null);

function decodeJwt(token) {
  try {
    const [, payload] = token.split('.');
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('gp_share_token');
    const storedUser = localStorage.getItem('gp_share_user');

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setIsLoadingAuth(false);
  }, []);

  const login = async (email, password) => {
    setAuthError(null);

    try {
      const form = new URLSearchParams();
      form.append('username', email);
      form.append('password', password);

      const res = await api.post('/auth/login', form, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      const token = res.data.access_token;
      const payload = decodeJwt(token);

      if (!payload) throw new Error('Invalid token payload');

      const userData = {
        id: payload.sub,
        role: payload.role,
        email,
      };

      localStorage.setItem('gp_share_token', token);
      localStorage.setItem('gp_share_user', JSON.stringify(userData));

      setUser(userData);

      return { success: true, user: userData };
    } catch (err) {
      console.error('Login error:', err);
      setAuthError('Invalid email or password.');
      return { success: false };
    }
  };

  const logout = () => {
    localStorage.removeItem('gp_share_token');
    localStorage.removeItem('gp_share_user');
    setUser(null);
    window.location.href = '/signin';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoadingAuth,
        authError,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
