// [Riya] AuthContext.jsx - User login state, registration & localStorage sync
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axiosInstance, {
  TOKEN_KEY,
  getStoredToken,
  setAuthToken,
  clearStoredToken,
} from '../api/axiosInstance';

const AuthContext = createContext();

const USER_STORAGE_KEY = 'campusbite_user';

export const AuthProvider = ({ children }) => {
  // 1. Initial State from localStorage hydration
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem(USER_STORAGE_KEY);
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      console.warn('Failed to parse user from localStorage:', e);
      return null;
    }
  });

  const [token, setToken] = useState(() => getStoredToken() || null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // 2. Fetch fresh profile from backend on app load if token exists
  const fetchUserProfile = useCallback(async () => {
    const existingToken = getStoredToken();
    if (!existingToken) {
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.get('/auth/me');
      if (response.data) {
        setUser(response.data);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.data));
      }
    } catch (err) {
      console.warn('Session verification failed, clearing stale auth data:', err);
      // Stale or expired token
      clearStoredToken();
      localStorage.removeItem(USER_STORAGE_KEY);
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  // 3. Login Action
  const login = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const response = await axiosInstance.post('/auth/login', {
        email: email.trim().toLowerCase(),
        password,
      });

      const { token: receivedToken, user: receivedUser } = response.data;

      // Update token in localStorage & axios headers
      setAuthToken(receivedToken);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(receivedUser));

      setToken(receivedToken);
      setUser(receivedUser);
      setLoading(false);

      return { success: true, user: receivedUser };
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || err.message || 'Login failed. Please check credentials.';
      setAuthError(errorMsg);
      setLoading(false);
      throw new Error(errorMsg);
    }
  };

  // 4. Registration Action
  const register = async (userData) => {
    setLoading(true);
    setAuthError(null);
    try {
      const response = await axiosInstance.post('/auth/register', userData);
      const { token: receivedToken, user: receivedUser } = response.data;

      setAuthToken(receivedToken);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(receivedUser));

      setToken(receivedToken);
      setUser(receivedUser);
      setLoading(false);

      return { success: true, user: receivedUser };
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || err.message || 'Registration failed. Please try again.';
      setAuthError(errorMsg);
      setLoading(false);
      throw new Error(errorMsg);
    }
  };

  // 5. Logout Action
  const logout = () => {
    clearStoredToken();
    localStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);
    setToken(null);
    setAuthError(null);
  };

  // 6. Direct User Profile Update (e.g. after editing profile info)
  const updateUser = (updatedFields) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const value = {
    user,
    token,
    loading,
    authError,
    isAuthenticated: Boolean(token && user),
    isStudent: user?.role === 'student',
    isStaff: user?.role === 'staff',
    login,
    register,
    logout,
    updateUser,
    refreshUser: fetchUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
