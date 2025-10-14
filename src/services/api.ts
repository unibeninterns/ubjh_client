import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { getToken, saveTokens, removeTokens } from "./indexdb";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

// Interfaces based on userflow.md
export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: {
    pk: number;
    email: string;
    first_name: string;
    last_name: string;
    role_name?: "Admin" | "Manager" | "Frontdesk";
  };
}

export interface UserProfile {
  pk: number;
  email: string;
  first_name: string;
  last_name: string;
  role_name?: "Admin" | "Manager" | "Frontdesk";
}

export interface LoginCredentials {
  email_address: string;
  password: string;
}

export interface CreateBusinessAndUserData {
  user: {
    first_name: string;
    last_name: string;
    email_address: string;
    password: string;
    phone: string;
  };
  business: {
    name: string;
    contact_email: string;
    contact_phone: string;
    address: string;
  };
}

export interface InitializePaymentData {
  new_plan_id: string;
  customer_email: string;
  billing_cycle: "YEARLY" | "MONTHLY";
}

export interface VerifyPaymentData {
  payment_reference: string;
  new_plan_id: string;
  billing_cycle: "YEARLY" | "MONTHLY";
}

export interface ResetPasswordData {
  uidb64: string;
  token: string;
  password: string;
  password_confirm: string;
}

export interface CreateRoleData {
  name: string;
  description: string;
  permissions: string[];
}

export interface SendInvitationData {
  email: string;
  role_name: string;
  message: string;
}

export interface AcceptInvitationData {
  token: string;
  first_name: string;
  last_name: string;
  password: string;
  password_confirm: string;
}

export interface UpdateAccountData {
  first_name?: string;
  last_name?: string;
  phone?: string;
}

export interface UpdatePasswordData {
  current_password: string;
  new_password: string;
  new_password_confirm: string;
}

export interface ManualBookingData {
  guest_name: string;
  guest_phone: string;
  suite_type: string; // UUID of suite type
  check_in: string; // YYYY-MM-DD format
  check_out: string; // YYYY-MM-DD format
  status: "PENDING" | "CONFIRMED" | "CHECKED_IN" | "CHECKED_OUT" | "CANCELLED";
  payment_status: "PENDING" | "PAID" | "REFUNDED";
  payment_method?: string;
}

export interface SuiteTypeData {
  name: string;
  slug: string;
  description: string;
  short_description: string;
  capacity: number;
  amenities: string[];
  base_price: string;
  is_active: boolean;
}

export interface SuiteInventoryUpdate {
  status: "AVAILABLE" | "OCCUPIED" | "MAINTENANCE" | "OUT_OF_ORDER";
}

export interface RoomData {
  suite_type: string;
  room_number: string;
  floor: string;
  notes?: string;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  channel: "EMAIL" | "SMS";
  event: string;
  subject: string;
  template: string;
  is_active: boolean;
}

export interface UpdateTemplateData {
  subject?: string;
  template?: string;
  is_active?: boolean;
}

export interface PayoutAccountData {
  bank_name: string;
  account_number: string;
  account_name: string;
  bank_code: string;
}

interface CustomRequestConfig extends InternalAxiosRequestConfig {
  _retry: boolean;
}

const createApi = (baseURL: string): AxiosInstance => {
  const api = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
    timeout: 10000,
  });

  api.interceptors.request.use(
    async (config) => {
      const authEndpoints = [
        "/auth/login/",
        "/onboarding/validate-email/",
        "/onboarding/validate-business-name/",
        "/onboarding/create-business-and-user/",
        "/password/forgot/",
        "/password/reset/",
        "/auth/refresh/",
        "/verify/",
      ];

      const skipAuth = authEndpoints.some((endpoint) =>
        config.url?.includes(endpoint)
      );

      if (!skipAuth) {
        try {
          const token = await getToken("accessToken");
          if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
          }
        } catch (error) {
          console.error("Error getting token for request:", error);
        }
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config;

      if (
        error.response?.status === 401 &&
        originalRequest &&
        !(originalRequest as CustomRequestConfig)._retry
      ) {
        const authEndpoints = ["/auth/login/"];

        const isAuthEndpoint = authEndpoints.some((endpoint) =>
          originalRequest.url?.includes(endpoint)
        );

        if (isAuthEndpoint) {
          return Promise.reject(error);
        }

        (originalRequest as CustomRequestConfig)._retry = true;

        if (isRefreshing && refreshPromise) {
          try {
            const newToken = await refreshPromise;
            if (newToken) {
              originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
              return api(originalRequest);
            }
          } catch (refreshError) {
            console.error(
              "Interceptor: Failed to wait for token refresh:",
              refreshError
            );
            await onAuthFailure();
            return Promise.reject(error);
          }
        }

        if (!isRefreshing) {
          isRefreshing = true;
          refreshPromise = refreshAccessToken();

          try {
            const newToken = await refreshPromise;
            if (newToken) {
              originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
              return api(originalRequest);
            } else {
              await onAuthFailure();
              return Promise.reject(error);
            }
          } catch (refreshError) {
            console.error("Interceptor: Token refresh failed:", refreshError);
            await onAuthFailure();
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

const accountsApi = createApi(`${API_URL}/accounts`);
const bookingsApiInstance = createApi(`${API_URL}/bookings`);
const communicationsApiInstance = createApi(`${API_URL}/communications`);
const paymentsApiInstance = createApi(`${API_URL}/payments`);

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    console.log("Attempting to refresh access token");

    const refreshToken = await getToken("refreshToken");
    if (!refreshToken) {
      console.log("No refresh token found");
      return null;
    }

    const response = await accountsApi.post("/auth/refresh/", {
      refresh: refreshToken,
    });

    if (response.data.access_token) {
      console.log("Token refresh successful");
      await saveTokens(response.data.access_token, refreshToken);
      return response.data.access_token;
    }

    if (response.data?.data?.access) {
      console.log("Token refresh successful (secondary check)");
      await saveTokens(response.data.data.access, refreshToken);
      return response.data.data.access;
    }
    console.log("No access token in refresh response");
    return null;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error("--- Token Refresh Failed ---");
    console.error("Message:", axiosError.message);
    if (axiosError.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Status:", axiosError.response.status);
      console.error("Response Data:", axiosError.response.data);
      console.error("Headers:", axiosError.response.headers);
    } else if (axiosError.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser
      console.error(
        "No response received. Request details:",
        axiosError.request
      );
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Axios setup error:", axiosError.message);
    }
    console.error("Config:", axiosError.config);
    console.error("--------------------------");
    return null;
  }
};

let onAuthFailure = async () => {
  console.log("Handling authentication failure - clearing tokens");
  await removeTokens();

  if (typeof window !== "undefined") {
    window.location.href = "/";
  }
};

export const setAuthFailureHandler = (handler: () => Promise<void>) => {
  onAuthFailure = handler;
};

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const response = await accountsApi.post("/auth/login/", credentials);

      if (response.data.status === "success" && response.data.access_token) {
        const { access_token, refresh_token, user } = response.data;
        await saveTokens(access_token, refresh_token);

        // Transform to match your interface
        return {
          access_token: access_token,
          refresh_token: refresh_token,
          user: {
            pk: parseInt(user.id, 10),
            email: user.email || "",
            first_name: user.first_name,
            last_name: user.last_name,
            role_name: user.role_name,
          },
        };
      }
      throw new Error("Login failed: Unexpected response structure from API.");
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    try {
      const refreshToken = await getToken("refreshToken");
      await accountsApi.post("/auth/logout/", { refresh: refreshToken });
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      await removeTokens();
    }
  },

  getUser: async (): Promise<UserProfile> => {
    try {
      const response = await accountsApi.get("/auth/from-auth/");
      const user = response.data.user;

      return {
        pk: parseInt(user.id, 10),
        email: user.email || "",
        first_name: user.first_name,
        last_name: user.last_name,
        role_name: user.role_name,
      };
    } catch (error) {
      console.error("Get user failed:", error);
      throw error;
    }
  },

  forgotPassword: async (email: string): Promise<string> => {
    try {
      const response = await accountsApi.post("/password/forgot/", {
        email_address: email,
      });
      return response.data.message;
    } catch (error) {
      console.error("Forgot password failed:", error);
      throw error;
    }
  },

  validateEmail: async (
    email: string
  ): Promise<{ is_valid: boolean; message: string }> => {
    try {
      const response = await accountsApi.post("/onboarding/validate-email/", {
        email_address: email,
      });
      return response.data;
    } catch (error) {
      console.error("Email validation failed:", error);
      throw error;
    }
  },

  validateBusinessName: async (
    name: string
  ): Promise<{
    is_valid: boolean;
    message: string;
    subdomain_preview: string;
  }> => {
    try {
      const response = await accountsApi.post(
        "/onboarding/validate-business-name/",
        {
          name,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Business name validation failed:", error);
      throw error;
    }
  },

  createBusinessAndUser: async (
    data: CreateBusinessAndUserData
  ): Promise<{ business_id: string; user_id: string }> => {
    try {
      const response = await accountsApi.post(
        "/onboarding/create-business-and-user/",
        data
      );
      return response.data.data;
    } catch (error) {
      console.error("Create business and user failed:", error);
      throw error;
    }
  },

  getOnboardingStatus: async (businessId: string): Promise<any> => {
    try {
      const response = await accountsApi.get(
        `/onboarding/status/${businessId}/`
      );
      return response.data.data;
    } catch (error) {
      console.error("Get onboarding status failed:", error);
      throw error;
    }
  },

  setupDomain: async (businessId: string, domain: string): Promise<any> => {
    try {
      const response = await accountsApi.post(
        `/onboarding/setup-domain/${businessId}/`,
        { domain }
      );
      return response.data.data;
    } catch (error) {
      console.error("Setup domain failed:", error);
      throw error;
    }
  },

  getSubscriptionPlans: async (): Promise<any[]> => {
    try {
      const response = await accountsApi.get("/onboarding/subscription-plans/");
      return response.data.data.plans;
    } catch (error) {
      console.error("Get subscription plans failed:", error);
      throw error;
    }
  },

  initializePayment: async (data: InitializePaymentData): Promise<any> => {
    try {
      const response = await paymentsApiInstance.post("/initialize/", data);
      return response.data.data;
    } catch (error) {
      console.error("Initialize payment failed:", error);
      throw error;
    }
  },

  verifyPayment: async (data: VerifyPaymentData): Promise<string> => {
    try {
      const response = await paymentsApiInstance.post("/verify/", data);
      return response.data.message;
    } catch (error) {
      console.error("Verify payment failed:", error);
      throw error;
    }
  },

  resetPassword: async (data: ResetPasswordData): Promise<string> => {
    try {
      const response = await accountsApi.post("/password/reset/", data);
      return response.data.message;
    } catch (error) {
      console.error("Reset password failed:", error);
      throw error;
    }
  },

  verifyToken: async (uidb64: string, token: string): Promise<any> => {
    try {
      const response = await accountsApi.get(`/verify/${uidb64}/${token}/`);
      return response.data;
    } catch (error) {
      console.error("Verify token failed:", error);
      throw error;
    }
  },

  listRoles: async (): Promise<any[]> => {
    try {
      const response = await accountsApi.get("/roles/");
      return response.data.data.roles;
    } catch (error) {
      console.error("List roles failed:", error);
      throw error;
    }
  },

  createRole: async (data: CreateRoleData): Promise<any> => {
    try {
      const response = await accountsApi.post("/roles/", data);
      return response.data.data.role;
    } catch (error) {
      console.error("Create role failed:", error);
      throw error;
    }
  },

  getRole: async (roleId: string): Promise<any> => {
    try {
      const response = await accountsApi.get(`/roles/${roleId}/`);
      return response.data.data.role;
    } catch (error) {
      console.error("Get role failed:", error);
      throw error;
    }
  },

  updateRole: async (
    roleId: string,
    data: Partial<CreateRoleData>
  ): Promise<any> => {
    try {
      const response = await accountsApi.put(`/roles/${roleId}/`, data);
      return response.data.data.role;
    } catch (error) {
      console.error("Update role failed:", error);
      throw error;
    }
  },

  deleteRole: async (roleId: string): Promise<any> => {
    try {
      const response = await accountsApi.delete(`/roles/${roleId}/`);
      return response.data;
    } catch (error) {
      console.error("Delete role failed:", error);
      throw error;
    }
  },

  listInvitations: async (): Promise<any[]> => {
    try {
      const response = await accountsApi.get("/invitations/");
      return response.data.data.invitations;
    } catch (error) {
      console.error("List invitations failed:", error);
      throw error;
    }
  },

  sendInvitation: async (data: SendInvitationData): Promise<string> => {
    try {
      const response = await accountsApi.post("/invitations/send/", data);
      return response.data.message;
    } catch (error) {
      console.error("Send invitation failed:", error);
      throw error;
    }
  },

  cancelInvitation: async (invitationId: string): Promise<string> => {
    try {
      const response = await accountsApi.post(
        `/invitations/${invitationId}/cancel/`
      );
      return response.data.message;
    } catch (error) {
      console.error("Cancel invitation failed:", error);
      throw error;
    }
  },

  validateInvitation: async (token: string): Promise<any> => {
    try {
      const response = await accountsApi.post("/invitations/validate/", {
        token,
      });
      return response.data;
    } catch (error) {
      console.error("Validate invitation failed:", error);
      throw error;
    }
  },

  acceptInvitation: async (data: AcceptInvitationData): Promise<string> => {
    try {
      const response = await accountsApi.post("/invitations/accept/", data);
      return response.data.message;
    } catch (error) {
      console.error("Accept invitation failed:", error);
      throw error;
    }
  },

  updateAccount: async (data: UpdateAccountData): Promise<UserProfile> => {
    try {
      const response = await accountsApi.post("/update_account/", data);
      return response.data.data.user;
    } catch (error) {
      console.error("Update account failed:", error);
      throw error;
    }
  },

  updatePassword: async (data: UpdatePasswordData): Promise<string> => {
    try {
      const response = await accountsApi.post("/update_password/", data);
      return response.data.message;
    } catch (error) {
      console.error("Update password failed:", error);
      throw error;
    }
  },
};
