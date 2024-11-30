import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the AuthContext type
interface AuthContextType {
  user: { token: string | null; role: string | null } | null;
  login: (token: string, role: string) => void;
  logout: () => void;
}

// Create context for authentication state with default value as null
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the AuthProvider component with an explicit `children` prop type
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);

  const login = (token: string, role: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    setUser({ token, role });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
