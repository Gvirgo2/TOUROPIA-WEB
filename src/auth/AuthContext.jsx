import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { token: newToken, data: { user: userData } } = response.data;
      
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('role', userData.role); // Store user role
      
      setToken(newToken);
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
    }
  };

  const signup = async (userData) => {
    try {
      const response = await authAPI.signup(userData);
      return { 
        success: true, 
        message: response.data.message 
      };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Signup failed' 
      };
    }
  };

  const forgotPassword = async (email) => {
    try {
      const response = await authAPI.forgotPassword(email);
      return { 
        success: true, 
        message: response.data.message || 'Password reset email sent successfully!' 
      };
    } catch (error) {
      console.error('AuthContext: ForgotPassword API error:', error);
      console.error('AuthContext: Error response:', error.response?.data);
      console.error('AuthContext: Error status:', error.response?.status);
      console.error('AuthContext: Error URL:', error.config?.url);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Failed to send reset email' 
      };
    }
  };

  const resetPassword = async (token, passwordData) => {
    try {
      const response = await authAPI.resetPassword(token, passwordData);
      return { 
        success: true, 
        message: response.data.message || 'Password reset successfully!' 
      };
    } catch (error) {
      console.error('AuthContext: ResetPassword API error:', error);
      console.error('AuthContext: Error response:', error.response?.data);
      console.error('AuthContext: Error status:', error.response?.status);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Password reset failed' 
      };
    }
  };

  const verifyEmail = async (token) => {
    try {
      const response = await authAPI.verifyEmail(token);
      return { 
        success: true, 
        message: response.data.message 
      };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Email verification failed' 
      };
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    signup,
    forgotPassword,
    resetPassword,
    verifyEmail,
    isAuthenticated: !!token,
    isAdmin: user?.role === 'admin', // Expose isAdmin boolean
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 