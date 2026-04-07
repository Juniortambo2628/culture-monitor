"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import axiosInstance from "@/lib/axios";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";

interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'participant' | string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const fetchProfile = useCallback(async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
        setIsLoading(false);
        return;
    }

    try {
      const response = await axiosInstance.get("/user");
      setUser(response.data);
    } catch (error: any) {
      if (error?.response?.status === 401) {
        localStorage.removeItem("auth_token");
        setUser(null);
      } else {
        console.error("Session restoration failed:", error);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Session restoration on mount
    fetchProfile();

    // Response Interceptor for handling 401 Unauthorized globally
    const interceptor = axiosInstance.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401 || error.response?.status === 403) {
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('auth_token');
                    setUser(null);
                }
            }
            return Promise.reject(error);
        }
    );

    return () => {
        axiosInstance.interceptors.response.eject(interceptor);
    };
  }, [fetchProfile]);

  const login = (token: string, user: AuthUser) => {
    localStorage.setItem("auth_token", token);
    setUser(user);
    
    // Redirect based on role
    if (user.role === 'admin') {
      router.push("/admin");
    } else {
      router.push("/user");
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/logout");
    } catch (e) {
      console.error("Logout request failed", e);
    } finally {
      localStorage.removeItem("auth_token");
      setUser(null);
      toast.success("Signed out safely.");
      // Force a full refresh to clear all application state and prevent loops
      window.location.href = "/";
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        isLoading, 
        login, 
        logout,
        refreshUser: fetchProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
