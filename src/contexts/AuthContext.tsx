// "use client";

// import React, { createContext, useContext, useState, useEffect } from 'react';

// type UserRole = 'user' | 'admin';

// type AuthContextType = {
//   user: { role: UserRole; name: string; email: string } | null;
//   isAuthenticated: boolean;
//   login: (userData: any) => void;
//   logout: () => void;
// };

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<{ role: UserRole; name: string; email: string } | null>(null);

//   const login = (userData: any) => {
//     // TODO: Replace with actual Keycloak authentication
//     // For now, using dummy data for testing
//     setUser({
//       role: userData.role || 'user', // Change to 'admin' to test admin flow
//       name: userData.name || 'Shivam Mishra',
//       email: userData.email || 'shivam@hdfc.com'
//     });
//   };

//   const logout = () => {
//     setUser(null);
//     // TODO: Add Keycloak logout
//   };

//   useEffect(() => {
//     // TODO: Check for existing Keycloak session
//     // For testing, auto-login as user
//     login({ role: 'user' }); // Change to 'admin' to test admin flow
//   }, []);

//   return (
//     <AuthContext.Provider value={{
//       user,
//       isAuthenticated: !!user,
//       login,
//       logout
//     }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error('useAuth must be used within AuthProvider');
//   return context;
// };



"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type UserRole = 'user' | 'admin';

type User = {
  id: string;
  role: UserRole;
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: Partial<User>) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void; // For testing purposes
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (userData: Partial<User>) => {
    const newUser: User = {
      id: userData.id || '1',
      role: userData.role || 'user',
      name: userData.name || 'Shivam Mishra',
      email: userData.email || 'shivam@hdfc.com'
    };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // For testing - switch between user and admin
  const switchRole = (role: UserRole) => {
    if (user) {
      const updatedUser = { ...user, role };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
      }
    } else {
      // Auto-login for testing - START AS USER to see prospects
      login({ role: 'user' });
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      logout,
      switchRole
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