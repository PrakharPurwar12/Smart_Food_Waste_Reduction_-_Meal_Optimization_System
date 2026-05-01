import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, logout as apiLogout } from '../services/authService';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await api.get('auth/me/');
          if (response.success) {
            setUser(response.data);
          } else {
            throw new Error(response.error || 'Failed to fetch user');
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await apiLogin(credentials);
      if (response.success) {
        localStorage.setItem('token', response.data.access);
        localStorage.setItem('refreshToken', response.data.refresh);
        setUser(response.data.user);
        return response.data.user;
      } else {
        throw new Error(response.error || 'Login failed');
      }
    } catch (error) {
      const message = error.response?.data?.error || error.message || 'Login failed';
      throw new Error(message);
    }
  };

  const register = async (data) => {
    try {
      const response = await apiRegister(data);
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error || 'Registration failed');
      }
    } catch (error) {
      const message = error.response?.data?.error || error.message || 'Registration failed';
      throw new Error(message);
    }
  };

  const logout = () => {
    apiLogout();
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const response = await api.get('auth/me/');
      if (response.success) {
        setUser(response.data);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
