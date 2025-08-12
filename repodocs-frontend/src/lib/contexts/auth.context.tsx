"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User } from "@/lib/types";
import {
  authService,
  AuthResponse,
  AuthStatus,
} from "@/lib/services/auth.service";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  loginWithGitHub: () => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);

      if (authService.isAuthenticated()) {
        const authStatus = await authService.getAuthStatus();

        if (authStatus.authenticated && authStatus.user) {
          // Get full user profile from dashboard endpoint
          const userProfile = await authService.getProfile();
          setUser(userProfile);
          setIsAuthenticated(true);
        } else {
          // Token exists but invalid, clear it
          await logout();
        }
      }
    } catch (error) {
      console.error("Auth status check failed:", error);
      await logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authService.localLogin({ username, password });

      // Token is automatically stored by auth service
      setUser(response.user as User);
      setIsAuthenticated(true);

      // Redirect to dashboard after successful login
      if (typeof window !== "undefined") {
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    try {
      setIsLoading(true);
      const response = await authService.localRegister({
        username,
        email,
        password,
      });

      // Don't set user as authenticated after registration
      // User needs to login separately
      // Token is stored but user is not logged in yet
      
      return response;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGitHub = async () => {
    try {
      const authUrl = await authService.initiateGitHubAuth();
      // Redirect to GitHub OAuth
      window.location.href = authUrl;
    } catch (error) {
      console.error("GitHub OAuth initiation failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const refreshUser = async () => {
    try {
      // Always try to refresh user data if we have a token
      // This is especially important after OAuth callback
      const userProfile = await authService.getProfile();
      setUser(userProfile);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("User refresh failed:", error);
      // If refresh fails, user might be logged out
      await logout();
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    loginWithGitHub,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
