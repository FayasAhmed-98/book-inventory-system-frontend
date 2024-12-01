import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  ReactNode,
  useCallback,
} from "react";

// Interface for AuthContext structure
interface AuthContextType {
  user: { token: string | null; role: string | null } | null; // User object with token and role
  login: (token: string, role: string) => void; // Function to log in
  logout: () => void; // Function to log out
}

// Create AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component to manage authentication state
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<{
    token: string | null;
    role: string | null;
  } | null>(null); // State to store user data

  // Memoized function to log in the user
  const login = useCallback((token: string, role: string) => {
    localStorage.setItem("token", token); // Save token in local storage
    localStorage.setItem("role", role); // Save role in local storage
    setUser({ token, role }); // Update user state
  }, []);

  // Memoized function to log out the user
  const logout = useCallback(() => {
    localStorage.removeItem("token"); // Remove token from local storage
    localStorage.removeItem("role"); // Remove role from local storage
    setUser(null); // Clear user state
  }, []);

  // Memoized context value
  const contextValue = useMemo(
    () => ({ user, login, logout }),
    [user, login, logout]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Hook to use AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider"); // Ensures hook is used inside a provider
  }
  return context;
};
