import axios from 'axios';

// Use proxy in development, direct URL in production
const API_BASE_URL = import.meta.env.DEV 
  ? '/api/v1'  // This will use the Vite proxy
  : 'https://visit-ethiopia-backend-ku5l.vercel.app/api/v1';

// Ensure the base URL ends with a slash for proper URL construction
const normalizedBaseURL = API_BASE_URL.endsWith('/') ? API_BASE_URL : API_BASE_URL + '/';

console.log('API_BASE_URL:', API_BASE_URL);
console.log('Environment:', import.meta.env.DEV ? 'development' : 'production');

const api = axios.create({
  baseURL: normalizedBaseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.url);
    console.log('Full URL:', config.baseURL + config.url);
    console.log('Request method:', config.method);
    console.log('Request headers:', config.headers);
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data, error.config?.url);
    
    // Don't auto-redirect for certain endpoints that might legitimately return 401
    const skipRedirectEndpoints = [
      '/users/forgotPassword',
      '/users/signup',
      '/users/login'
    ];
    
    const isSkipEndpoint = skipRedirectEndpoints.some(endpoint => 
      error.config?.url?.includes(endpoint)
    );
    
    if (error.response?.status === 401 && !isSkipEndpoint) {
      // Clear auth data and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Only redirect if not already on login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API methods - aligned with backend router
export const authAPI = {
  // User registration - POST /users/signup
  signup: (userData) => api.post('/users/signup', userData),
  
  // User login - POST /users/login
  login: (credentials) => api.post('/users/login', credentials),
  
  // User logout - POST /users/logout
  logout: () => api.post('/users/logout'),
  
  // Email verification - GET /users/verify/{token}
  verifyEmail: (token) => api.get(`/users/verify/${token}`),
  
  // Forgot password - POST /users/forgotPassword
  forgotPassword: (email) => api.post('/users/forgotPassword', { email }),
  
  // Reset password - PATCH /users/resetPassword/{token}
  resetPassword: (token, passwordData) => api.patch(`/users/resetPassword/${token}`, passwordData),
  
  // Update password (protected) - PATCH /users/updatePassword
  updatePassword: (passwordData) => api.patch('/users/updatePassword', passwordData),
  
  // Test authentication (protected) - GET /users/test
  testAuth: () => api.get('/users/test'),
};

export default api; 