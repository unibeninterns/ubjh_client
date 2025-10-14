"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { authApi, refreshAccessToken, CreateBusinessAndUserData, setAuthFailureHandler } from "../services/api";
import { getToken, removeTokens } from "../services/indexdb";

interface User {
  pk: number;
  email: string;
  first_name: string;
  last_name: string;
  role_name?: 'Admin' | 'Manager' | 'Frontdesk';
  isAuthenticated: boolean;
}

interface AuthContextType {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  isManager?: boolean;
  isAdmin?: boolean;
  isFrontdesk?: boolean;
  error: string | null;
  checkAuth: () => Promise<boolean>;
  clearError: () => void;
  validateEmail: (email: string) => Promise<{ is_valid: boolean; message: string }>;
  validateBusinessName: (name: string) => Promise<{ is_valid: boolean; message: string; subdomain_preview: string }>;
  createBusinessAndUser: (data: CreateBusinessAndUserData) => Promise<{ business_id: string; user_id: string }>;
  getSubscriptionPlans: () => Promise<any[]>;
  initializePayment: (data: any) => Promise<any>;
  verifyPayment: (data: any) => Promise<string>;
  
    validateInvitation: (token: string) => Promise<{ is_valid: boolean; message?: string; data?: any }>;
  acceptInvitation: (data: {
    token: string;
    first_name: string;
    last_name: string;
    password: string;
    password_confirm: string;
  }) => Promise<string>;
}

interface AuthProviderProps {
  children: ReactNode;
  userType?: 'admin' | 'manager' | 'frontdesk';
  requireAuth?: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<AuthProviderProps> = ({ 
  children, 
  userType = 'manager',
  requireAuth = false
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Define a context-aware failure handler
    const handleAuthFailure = async () => {
      console.log(`Handling ${userType} authentication failure.`);
      await removeTokens();

      // Role-specific redirect logic
      if (userType === 'manager') {
        router.push('/login');
      } else if (userType === 'admin') {
        router.push('/admin/login');
      } else {
        router.push('/frontdesk/login');
      }
    };

    // Set this handler as the one for the API service to use
    setAuthFailureHandler(handleAuthFailure);

  }, [router, userType]);

  const checkAuth = useCallback(async (): Promise<boolean> => {
    console.log("Checking authentication...");
    try {
      setLoading(true);
      setError(null);

      const token = await getToken('accessToken');

      if (!token) {
        console.log("No token found, user not authenticated");
        setUser(null);
        setLoading(false);
        return false;
      }

      try {
        console.log("Verifying token with server...");
        const response = await authApi.getUser();

        setUser({
          ...response,
          isAuthenticated: true,
        });
        return true;
      } catch (error: unknown) {
        console.error("Token verification failed:", error);

        const status = (error as { response?: { status: number } })?.response?.status;

        if (status === 401 || status === 403) {
          console.log("Attempting to refresh token after failed verification");
          const newToken = await refreshAccessToken();

          if (newToken) {
            console.log("Token refreshed successfully, verifying again");
            try {
              const response = await authApi.getUser();
              setUser({
                ...response,
                isAuthenticated: true,
              });
              return true;
            } catch (verifyError) {
              console.error("Verification after refresh failed:", verifyError);
              await removeTokens();
              setUser(null);
              setError("Session expired. Please login again.");
              return false;
            }
          } else {
            console.log("Token refresh failed, clearing tokens");
            await removeTokens();
          }
        }

        setUser(null);
        setError(error instanceof Error ? error.message : "Authentication failed");
        return false;
      }
    } catch (error: unknown) {
      console.error("Auth check failed:", error);
      setUser(null);
      setError("Authentication check failed");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (requireAuth) {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, [checkAuth, requireAuth]);

  const login = async (email: string, password: string): Promise<boolean> => {
  setLoading(true);
  setError(null);
  try {
    // Use the unified login endpoint
    const data = await authApi.login({ email_address: email, password });
    console.log("Login successful", data);
    
    setUser({
      ...data.user,
      isAuthenticated: true,
    });
    
      if (data.user.role_name === 'Admin') {
        router.push('/admin/dashboard');
      } else if (data.user.role_name === 'Manager') {
        router.push('/manager/dashboard');
      } else if (data.user.role_name === 'Frontdesk') {
        router.push('/frontdesk/dashboard');
      } else {
        // Fallback for any other roles or if role is undefined
        router.push('/');
      }
      return true;
    } catch (error: unknown) {
      console.error("Login failed:", error);
      const errorMessage = (error as { response?: { data?: { detail?: string; message?: string; }; }; message?: string; }).response?.data?.detail || 
                          (error as { response?: { data?: { detail?: string; message?: string; }; }; message?: string; }).response?.data?.message || 
                          (error as Error).message || 
                          "Login failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      console.log("Logging out...");
      await authApi.logout();
      console.log("Logout API call successful");
    } catch (error: unknown) {
      console.error("Logout API call failed:", error);
      setError((error instanceof Error ? error.message : "Logout failed"));
    } finally {
      console.log("Removing local tokens");
      await removeTokens();
      setUser(null);
      setError(null);
      setLoading(false);
      if (userType === 'admin') {
        router.push("/admin/login");
      } else if (userType === 'manager') {
        router.push("/login");
      } else {
        router.push("/frontdesk/login");
      }
    }
  };

  const validateEmail = async (email: string) => {
    try {
      return await authApi.validateEmail(email);
    } catch (error) {
      console.error("Email validation failed:", error);
      throw error;
    }
  };

  const validateBusinessName = async (name: string) => {
    try {
      return await authApi.validateBusinessName(name);
    } catch (error) {
      console.error("Business name validation failed:", error);
      throw error;
    }
  };

  const createBusinessAndUser = async (data: CreateBusinessAndUserData) => {
    try {
      return await authApi.createBusinessAndUser(data);
    } catch (error) {
      console.error("Create business and user failed:", error);
      throw error;
    }
  };

  const validateInvitation = async (token: string) => {
    try {
      return await authApi.validateInvitation(token);
    } catch (error) {
      console.error("Validate invitation failed:", error);
      throw error;
    }
  };

  const acceptInvitation = async (data: {
    token: string;
    first_name: string;
    last_name: string;
    password: string;
    password_confirm: string;
  }) => {
    try {
      return await authApi.acceptInvitation(data);
    } catch (error) {
      console.error("Accept invitation failed:", error);
      throw error;
    }
  };

  const getSubscriptionPlans = async () => {
    try {
      return await authApi.getSubscriptionPlans();
    } catch (error) {
      console.error("Get subscription plans failed:", error);
      throw error;
    }
  };

  const initializePayment = async (data: any) => {
    try {
      return await authApi.initializePayment(data);
    } catch (error) {
      console.error("Initialize payment failed:", error);
      throw error;
    }
  };

  const verifyPayment = async (data: any) => {
    try {
      return await authApi.verifyPayment(data);
    } catch (error) {
      console.error("Verify payment failed:", error);
      throw error;
    }
  };

  const clearError = (): void => {
    setError(null);
  };

  const contextValue: AuthContextType = {
    user,
    loading,
    error,
    login,
    logout,
    checkAuth,
    clearError,
    isAuthenticated: !!user,
    validateEmail,
    validateBusinessName,
    createBusinessAndUser,
    getSubscriptionPlans,
    initializePayment,
    verifyPayment,
    validateInvitation,
    acceptInvitation,
    isManager: user?.role_name === 'Manager',
    isAdmin: user?.role_name === 'Admin',
    isFrontdesk: user?.role_name === 'Frontdesk',
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export function withManagerAuth<P extends object>(Component: React.ComponentType<P>) {
  return function ManagerProtected(props: P) {
    const { user, loading, error, isManager, checkAuth } = useAuth();
    const router = useRouter();
    const [retryCount, setRetryCount] = useState(0);
    const MAX_RETRIES = 1;

    useEffect(() => {
      if (!loading && !user && error && retryCount < MAX_RETRIES) {
        const retryAuth = async () => {
          console.log("Retrying authentication...");
          setRetryCount((prev) => prev + 1);
          const success = await checkAuth();
          if (!success || !isManager) {
            console.log("Auth retry failed, redirecting to login");
            router.push("/login");
          }
        };
        retryAuth();
      } else if (!loading) {
        if (!user) {
          router.push("/login");
        } else if (!isManager) {
          router.push("/");
        }
      }
    }, [user, loading, error, isManager, router, checkAuth, retryCount]);

    if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    if (!user || !isManager) return null;

    return <Component {...props} />;
  };
}

export function withAdminAuth<P extends object>(Component: React.ComponentType<P>) {
  return function AdminProtected(props: P) {
    const { user, loading, isAdmin, error, checkAuth } = useAuth();
    const router = useRouter();
    const [retryCount, setRetryCount] = useState(0);
    const MAX_RETRIES = 1;

    useEffect(() => {
      if (!loading && !user && error && retryCount < MAX_RETRIES) {
        const retryAuth = async () => {
          setRetryCount((prev) => prev + 1);
          const success = await checkAuth();
          if (!success || !isAdmin) {
            router.push("/admin/login");
          }
        };
        retryAuth();
      } else if (!loading) {
        if (!user) {
          router.push("/admin/login");
        } else if (!isAdmin) {
          router.push("/");
        }
      }
    }, [user, loading, error, isAdmin, router, checkAuth, retryCount]);

    if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    if (!user || !isAdmin) return null;

    return <Component {...props} />;
  };
}

export function withFrontdeskAuth<P extends object>(Component: React.ComponentType<P>) {
  return function FrontdeskProtected(props: P) {
    const { user, loading, isFrontdesk, error, checkAuth } = useAuth();
    const router = useRouter();
    const [retryCount, setRetryCount] = useState(0);
    const MAX_RETRIES = 1;

    useEffect(() => {
      if (!loading && !user && error && retryCount < MAX_RETRIES) {
        const retryAuth = async () => {
          setRetryCount((prev) => prev + 1);
          const success = await checkAuth();
          if (!success || !isFrontdesk) {
            router.push("/frontdesk/login");
          }
        };
        retryAuth();
      } else if (!loading) {
        if (!user) {
          router.push("/frontdesk/login");
        } else if (!isFrontdesk) {
          router.push("/");
        }
      }
    }, [user, loading, error, isFrontdesk, router, checkAuth, retryCount]);

    if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    if (!user || !isFrontdesk) return null;

    return <Component {...props} />;
  };
}
