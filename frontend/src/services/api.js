import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for consistent error handling and auth expiry
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // If token expired or invalid (401), logout and redirect
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      // Use window.location to force a reload and redirect to login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login?expired=true';
      }
    }

    const message = error.response?.data?.error || error.response?.data?.message || 'An unexpected error occurred';
    return Promise.reject({ ...error, message });
  }
);

export default api;
