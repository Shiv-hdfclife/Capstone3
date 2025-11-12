"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type UserRole = 'user' | 'admin';

type AuthContextType = {
  user: { role: UserRole; name: string; email: string } | null;
  isAuthenticated: boolean;
  login: (userData: any) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ role: UserRole; name: string; email: string } | null>(null);

  const login = (userData: any) => {
    // TODO: Replace with actual Keycloak authentication
    // For now, using dummy data for testing
    setUser({
      role: userData.role || 'user', // Change to 'admin' to test admin flow
      name: userData.name || 'Shivam Mishra',
      email: userData.email || 'shivam@hdfc.com'
    });
  };

  const logout = () => {
    setUser(null);
    // TODO: Add Keycloak logout
  };

  useEffect(() => {
    // TODO: Check for existing Keycloak session
    // For testing, auto-login as user
    login({ role: 'user' }); // Change to 'admin' to test admin flow
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};