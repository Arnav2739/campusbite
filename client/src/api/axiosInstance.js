/**
 * @file axiosInstance.js
 * @description Configured Axios client instance for CampusBite.
 * Automatically injects the JWT Authorization Bearer header into outgoing requests
 * and intercepts HTTP 401 unauthorized errors to clear credentials and redirect to /login.
 * @author Aditya (feat/aditya-auth-security)
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
export const TOKEN_KEY = 'campusbite_token';

/**
 * Retrieves the currently stored authentication token from localStorage.
 * @returns {string|null} The JWT string or null if not authenticated.
 */
export const getStoredToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Saves a newly issued authentication token to localStorage.
 * @param {string} token - The signed JWT token.
 */
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

/**
 * Removes the stored authentication token from localStorage.
 */
export const clearStoredToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

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
    const token = getStoredToken();
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
      clearStoredToken();

      // Redirect to login page (only if not already there)
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;


