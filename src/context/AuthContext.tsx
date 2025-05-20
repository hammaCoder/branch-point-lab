
import React, { createContext, useState, useContext, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'instructor' | 'student';
  isGitHubAuthenticated: boolean;
  accessToken?: string;
  refreshToken?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  authenticateGitHub: () => void;
  handleOidcCallback: (searchParams: URLSearchParams) => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => {},
  logout: () => {},
  authenticateGitHub: () => {},
  handleOidcCallback: async () => null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated (from localStorage)
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const storedUser = localStorage.getItem('codecast_user');
        const storedTokenExpiry = localStorage.getItem('codecast_token_expiry');
        
        if (storedUser && storedTokenExpiry) {
          const tokenExpiry = parseInt(storedTokenExpiry);
          
          // Check if token is expired
          if (tokenExpiry > Date.now()) {
            setUser(JSON.parse(storedUser));
          } else {
            // Token expired, clear storage
            localStorage.removeItem('codecast_user');
            localStorage.removeItem('codecast_token_expiry');
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = () => {
    // Generate and store a random state for security
    const state = generateRandomString();
    localStorage.setItem('codecast_auth_state', state);
    
    // Generate code verifier and challenge for PKCE
    const codeVerifier = generateRandomString();
    localStorage.setItem('codecast_code_verifier', codeVerifier);
    
    // Redirect to ABP OIDC login endpoint
    const authUrl = new URL('https://localhost:44375/connect/authorize');
    const params = {
      client_id: 'InteractiveCodingPlatform_ReactApp',
      redirect_uri: `${window.location.origin}/callback`,
      response_type: 'code',
      scope: 'openid profile email offline_access',
      state: state,
      code_challenge: codeVerifier, // Simplified for implementation; in production use proper PKCE
      code_challenge_method: 'plain', // In production, use S256
    };
    
    Object.entries(params).forEach(([key, value]) => {
      authUrl.searchParams.append(key, value);
    });
    
    window.location.href = authUrl.toString();
  };

  const handleOidcCallback = async (searchParams: URLSearchParams): Promise<User | null> => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const storedState = localStorage.getItem('codecast_auth_state');
    const codeVerifier = localStorage.getItem('codecast_code_verifier');
    
    // Verify state to prevent CSRF attacks
    if (!code || !state || state !== storedState) {
      console.error("Invalid authentication response");
      return null;
    }
    
    try {
      // Exchange code for tokens
      const tokenResponse = await fetch('https://localhost:44375/connect/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: 'InteractiveCodingPlatform_ReactApp',
          code: code,
          redirect_uri: `${window.location.origin}/callback`,
          code_verifier: codeVerifier || '',
        })
      });
      
      if (!tokenResponse.ok) {
        throw new Error('Failed to exchange code for tokens');
      }
      
      const tokenData = await tokenResponse.json();
      
      // Now fetch user info with the access token
      const userInfoResponse = await fetch('https://localhost:44375/connect/userinfo', {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`
        }
      });
      
      if (!userInfoResponse.ok) {
        throw new Error('Failed to fetch user info');
      }
      
      const userInfo = await userInfoResponse.json();
      
      // Calculate token expiry time (access_token)
      const expiresIn = tokenData.expires_in || 3600; // Default to 1 hour if not specified
      const expiryTime = Date.now() + expiresIn * 1000;
      
      // Create user object
      const user: User = {
        id: userInfo.sub,
        name: userInfo.name || userInfo.preferred_username || 'User',
        email: userInfo.email || '',
        role: userInfo.role || 'student', // Default to student if not specified
        isGitHubAuthenticated: false,
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token
      };
      
      // Store user data and token expiry
      localStorage.setItem('codecast_user', JSON.stringify(user));
      localStorage.setItem('codecast_token_expiry', expiryTime.toString());
      localStorage.removeItem('codecast_auth_state');
      localStorage.removeItem('codecast_code_verifier');
      
      setUser(user);
      return user;
    } catch (error) {
      console.error("Token exchange failed:", error);
      return null;
    }
  };

  const logout = () => {
    // Clear stored data
    localStorage.removeItem('codecast_user');
    localStorage.removeItem('codecast_token_expiry');
    localStorage.removeItem('codecast_auth_state');
    localStorage.removeItem('codecast_code_verifier');
    
    setUser(null);
    
    // Redirect to ABP logout endpoint
    window.location.href = `https://localhost:44375/connect/endsession?post_logout_redirect_uri=${encodeURIComponent(window.location.origin)}`;
  };

  const authenticateGitHub = () => {
    // Redirect to GitHub authentication endpoint
    window.location.href = 'https://localhost:44375/api/auth/github/login';
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    authenticateGitHub,
    handleOidcCallback,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Helper function to generate random string for state and PKCE
function generateRandomString(length = 32) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    result += charset[randomIndex];
  }
  return result;
}
