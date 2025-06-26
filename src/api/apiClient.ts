import axios from 'axios';

export type ApiResponse<T> = {
  data: T;
  message?: string;
  status?: number;
};

// Create an axios instance with default config
const apiClient = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com', // JSONPlaceholder API
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add request interceptor for adding auth tokens, etc.
apiClient.interceptors.request.use(
  (config) => {
    // You can add auth token here if needed
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for handling global errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global error here
    // For example, redirect to login if 401
    if (error.response?.status === 401) {
      // Handle unauthorized
      // router.push('/login');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
