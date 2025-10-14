import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { getToken, saveTokens, saveUserData, clearAllData } from "./indexdb";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

// Response interfaces matching your backend
export interface LoginResponse {
  success: boolean;
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  faculty?: string;
  affiliation?: string;
  orcid?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface VerifyTokenResponse {
  success: boolean;
  user: {
    id: string;
    role: string;
  };
}

interface CustomRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Create API instance
const createApi = (baseURL: string): AxiosInstance => {
  const api = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true, // Important for cookie-based auth
    timeout: 10000,
  });

  // Request interceptor - add access token from localStorage
  api.interceptors.request.use(
    async (config) => {
      // Skip auth for login endpoints
      const authEndpoints = [
        "/auth/admin-login",
        "/auth/author-login",
        "/auth/reviewer-login",
        "/auth/refresh-token",
      ];

      const skipAuth = authEndpoints.some((endpoint) =>
        config.url?.includes(endpoint)
      );

      if (!skipAuth) {
        const token = await getToken("accessToken");
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor - handle token refresh
  api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as CustomRequestConfig;

      // If 401 and not already retrying, try to refresh token
      if (
        error.response?.status === 401 &&
        originalRequest &&
        !originalRequest._retry
      ) {
        // Don't retry login requests
        const isLoginRequest = [
          "/auth/admin-login",
          "/auth/author-login",
          "/auth/reviewer-login",
        ].some((endpoint) => originalRequest.url?.includes(endpoint));

        if (isLoginRequest) {
          return Promise.reject(error);
        }

        originalRequest._retry = true;

        if (isRefreshing && refreshPromise) {
          try {
            await refreshPromise;
            return api(originalRequest);
          } catch (refreshError) {
            console.error("Error refreshing access token:", refreshError);
            await handleAuthFailure();
            return Promise.reject(error);
          }
        }

        if (!isRefreshing) {
          isRefreshing = true;
          refreshPromise = refreshAccessToken();

          try {
            await refreshPromise;
            return api(originalRequest);
          } catch (refreshError) {
            console.error("Error refreshing access token:", refreshError);
            await handleAuthFailure();
            return Promise.reject(error);
          } finally {
            isRefreshing = false;
            refreshPromise = null;
          }
        }
      }

      return Promise.reject(error);
    }
  );

  return api;
};

const api = createApi(API_URL);

let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

// Refresh access token using the cookie-based refresh token
export const refreshAccessToken = async (): Promise<void> => {
  try {
    console.log("Attempting to refresh access token");

    const response = await api.post("/auth/refresh-token", {});

    if (response.data.success && response.data.accessToken) {
      console.log("Token refresh successful");
      await saveTokens(response.data.accessToken);
      return;
    }

    throw new Error("Token refresh failed");
  } catch (error) {
    console.error("Token refresh failed:", error);
    throw error;
  }
};

let authFailureHandler: (() => Promise<void>) | null = null;

const handleAuthFailure = async () => {
  console.log("Handling authentication failure - clearing tokens");
  await clearAllData();

  if (authFailureHandler) {
    await authFailureHandler();
  } else if (typeof window !== "undefined") {
    window.location.href = "/";
  }
};

export const setAuthFailureHandler = (handler: () => Promise<void>) => {
  authFailureHandler = handler;
};

// Auth API methods
export const authApi = {
  // Admin login
  loginAdmin: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const response = await api.post("/auth/admin-login", credentials);

      if (response.data.success && response.data.accessToken) {
        await saveTokens(response.data.accessToken);
        await saveUserData(response.data.user);
        return response.data;
      }

      throw new Error("Login failed: Invalid response structure");
    } catch (error) {
      console.error("Admin login failed:", error);
      throw error;
    }
  },

  // Author login
  loginAuthor: async (
    credentials: LoginCredentials
  ): Promise<LoginResponse> => {
    try {
      const response = await api.post("/auth/author-login", credentials);

      if (response.data.success && response.data.accessToken) {
        await saveTokens(response.data.accessToken);
        await saveUserData(response.data.user);
        return response.data;
      }

      throw new Error("Login failed: Invalid response structure");
    } catch (error) {
      console.error("Author login failed:", error);
      throw error;
    }
  },

  // Reviewer login
  loginReviewer: async (
    credentials: LoginCredentials
  ): Promise<LoginResponse> => {
    try {
      const response = await api.post("/auth/reviewer-login", credentials);

      if (response.data.success && response.data.accessToken) {
        await saveTokens(response.data.accessToken);
        await saveUserData(response.data.user);
        return response.data;
      }

      throw new Error("Login failed: Invalid response structure");
    } catch (error) {
      console.error("Reviewer login failed:", error);
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    try {
      await api.post("/auth/logout", {});
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      await clearAllData();
    }
  },

  verifyToken: async (): Promise<VerifyTokenResponse> => {
    try {
      const response = await api.get("/auth/verify-token");
      return response.data;
    } catch (error) {
      console.error("Token verification failed:", error);
      throw error;
    }
  },
};

export default api;
