"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
  ComponentType,
} from "react";
import { useRouter } from "next/navigation";
import { authApi, setAuthFailureHandler } from "../services/api";
import {
  getToken,
  getUserData,
  clearAllData,
} from "../services/indexdb";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isInitialLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
  userType: "admin" | "author" | "reviewer";
}

export const AuthProvider = ({ children, userType }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Set up the auth failure handler for this context
  useEffect(() => {
    const handleAuthFailure = async () => {
      await clearAllData();
      setUser(null);

      // Role-specific redirect
      switch (userType) {
        case "admin":
          router.push("/admin/login");
          break;
        case "author":
          router.push("/author/login");
          break;
        case "reviewer":
          router.push("/reviewer/login");
          break;
      }
    };

    setAuthFailureHandler(handleAuthFailure);
  }, [router, userType]);

  // Check authentication on mount
  const checkAuth = useCallback(async (): Promise<boolean> => {
    try {
      const token = await getToken("accessToken");
      const userData = await getUserData();

      if (!token || !userData) {
        setUser(null);
        return false;
      }

      try {
        const parsedUser = userData as User;

        // Verify the user role matches the expected type
        const expectedRole = userType === "author" ? "author" : userType;
        if (parsedUser.role !== expectedRole) {
          await clearAllData();
          setUser(null);
          return false;
        }

        // Verify token with backend
        const response = await authApi.verifyToken();

        if (response.success && response.user.id === parsedUser.id) {
          setUser(parsedUser);
          return true;
        }

        return false;
      } catch (verifyError) {
        console.error("Token verification failed:", verifyError);
        await clearAllData();
        setUser(null);
        return false;
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
      return false;
    }
  }, [userType]);

  useEffect(() => {
    const initialAuth = async () => {
      await checkAuth();
      setIsInitialLoading(false);
    };
    initialAuth();
  }, [checkAuth]);

  // Login function
  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      let response;

      // Call the appropriate login endpoint based on userType
      switch (userType) {
        case 'admin':
          response = await authApi.loginAdmin({ email, password });
          break;
        case 'author':
          response = await authApi.loginAuthor({ email, password });
          break;
        case 'reviewer':
          response = await authApi.loginReviewer({ email, password });
          break;
        default:
          throw new Error('Invalid user type');
      }

      if (response.success && response.user) {
        // Verify role matches expected type
        const expectedRole = userType === 'author' ? 'author' : userType;
        
        if (response.user.role !== expectedRole) {
          throw new Error(
            `Invalid login. You are trying to log in as a ${userType} but your account is a ${response.user.role}.`
          );
        }

        setUser(response.user);

        // Redirect based on role
        switch (userType) {
          case 'admin':
            router.push('/admin/dashboard');
            break;
          case 'author':
            router.push('/author/dashboard');
            break;
          case 'reviewer':
            router.push('/reviewer/dashboard');
            break;
        }
      } else {
        throw new Error('Invalid login response');
      }
    } catch (err: any) {
      let errorMessage = 'An error occurred during login.';

      const authErrorMessages = [
        'Access denied: Admin privileges required',
        'Access denied: author privileges required',
        'Access denied: Reviewer privileges required',
        'No account found with this email address',
        'Incorrect password',
      ];

      if (err?.response?.data?.message && authErrorMessages.includes(err.response.data.message)) {
        errorMessage = 'Invalid credentials';
      } else if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }

      console.error('Login error:', err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setError(null);
      setIsLoading(false);

      // Redirect based on role
      switch (userType) {
        case 'admin':
          router.push('/admin/login');
          break;
        case 'author':
          router.push('/author/login');
          break;
        case 'reviewer':
          router.push('/reviewer/login');
          break;
      }
    }
  };

  // Clear error
  const clearError = (): void => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isInitialLoading,
    isAuthenticated: !!user,
    error,
    login,
    logout,
    clearError,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// HOC for protecting admin routes
export function withAdminAuth<P extends object>(
  Component: ComponentType<P>
) {
  return function AdminProtected(props: P) {
    const { user, isInitialLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isInitialLoading) {
        if (!user) {
          router.push('/admin/login');
        } else if (user.role !== 'admin') {
          router.push('/');
        }
      }
    }, [user, isInitialLoading, router]);

    if (isInitialLoading || !user || user.role !== 'admin') {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-800 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}

// HOC for protecting author routes
export function withAuthorAuth<P extends object>(
  Component: ComponentType<P>
) {
  return function AuthorProtected(props: P) {
    const { user, isInitialLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isInitialLoading) {
        if (!user) {
          router.push('/author/login');
        } else if (user.role !== 'author') {
          router.push('/');
        }
      }
    }, [user, isInitialLoading, router]);

    if (isInitialLoading || !user || user.role !== 'author') {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-800 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}

// HOC for protecting reviewer routes
export function withReviewerAuth<P extends object>(
  Component: ComponentType<P>
) {
  return function ReviewerProtected(props: P) {
    const { user, isInitialLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isInitialLoading) {
        if (!user) {
          router.push('/reviewer/login');
        } else if (user.role !== 'reviewer') {
          router.push('/');
        }
      }
    }, [user, isInitialLoading, router]);

    if (isInitialLoading || !user || user.role !== 'reviewer') {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-800 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}