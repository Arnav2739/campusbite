// [Aditya] axiosInstance.js - Axios config with automatic JWT header
// Commit 6: Added response interceptor for 401 auto-logout & request timeout
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
const TOKEN_KEY = 'campusbite_token';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // 15-second timeout for all requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Request interceptor: Attach JWT token to every outgoing request ---
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- Response interceptor: Handle 401 (expired/invalid token) globally ---
axiosInstance.interceptors.response.use(
  // Success: pass response through unchanged
  (response) => response,

  // Error: intercept 401 responses for auto-logout
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear stored token — it's expired or invalid
      localStorage.removeItem(TOKEN_KEY);

      // Redirect to login page (only if not already there)
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

