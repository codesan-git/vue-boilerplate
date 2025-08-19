// apiClient.ts
import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios';

export type ApiResponse<T> = {
  data: T;
  message?: string;
  status?: number;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
};

// Create a base config
const baseConfig: AxiosRequestConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.example.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

// Create instance for public API (no auth)
export const publicApi: AxiosInstance = axios.create(baseConfig);

// Create instance for authenticated API
export const authApi: AxiosInstance = axios.create(baseConfig);

// Add auth interceptor only to authApi
authApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Common response interceptor
const setupResponseInterceptor = (instance: AxiosInstance): void => {
  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        // Handle unauthorized
        localStorage.removeItem('token');
        // Optional: Redirect to login
        // window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
};

// Apply to both instances
setupResponseInterceptor(publicApi);
setupResponseInterceptor(authApi);

export default {
  public: publicApi,
  auth: authApi
} as const;