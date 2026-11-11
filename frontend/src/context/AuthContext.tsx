import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser } from '../types';

interface AuthContextType {
  token: string | null;
  admin: AdminUser | null;
  isAuthenticated: boolean;
  login: (token: string, user: AdminUser) => void;
  logout: () => void;
  isAdminView: boolean;
  setIsAdminView: (val: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('admin_token');
  });

  const [admin, setAdmin] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem('admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAdminView, setIsAdminView] = useState<boolean>(() => {
    return window.location.pathname.startsWith('/admin') || false;
  });

  useEffect(() => {
    if (token && admin) {
      localStorage.setItem('admin_token', token);
      localStorage.setItem('admin_user', JSON.stringify(admin));
    } else {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
    }
  }, [token, admin]);

  const login = (newToken: string, newUser: AdminUser) => {
    setToken(newToken);
    setAdmin(newUser);
  };

  const logout = () => {
    setToken(null);
    setAdmin(null);
    setIsAdminView(false);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        admin,
        isAuthenticated: !!token && !!admin,
        login,
        logout,
        isAdminView,
        setIsAdminView
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
