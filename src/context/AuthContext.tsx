
import React, { createContext, useState, useContext, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'instructor' | 'student';
  isGitHubAuthenticated: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  authenticateGitHub: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => {},
  logout: () => {},
  authenticateGitHub: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated (e.g., from localStorage or session)
    const checkAuth = async () => {
      try {
        // In a real implementation, you would check with your backend
        // For now, we'll just simulate a delay
        setTimeout(() => {
          const storedUser = localStorage.getItem('codecast_user');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = () => {
    // For OIDC authentication, redirect to your ABP backend login endpoint
    window.location.href = 'http://localhost:44375/api/account/login';
    // In a real implementation, you'd handle the redirect back with tokens
  };

  const logout = () => {
    localStorage.removeItem('codecast_user');
    setUser(null);
    // In a real implementation, you'd also call your logout endpoint
  };

  const authenticateGitHub = () => {
    // Redirect to GitHub authentication endpoint
    window.location.href = 'http://localhost:44375/api/auth/github/login';
    // In a real implementation, you'd handle the callback with GitHub tokens
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    authenticateGitHub,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
