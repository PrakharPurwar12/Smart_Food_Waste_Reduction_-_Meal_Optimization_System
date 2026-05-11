import api from './api';

export const login = (credentials) => api.post('auth/login/', credentials);
export const register = (data) => api.post('auth/register/', data);
export const logout = () => {
  localStorage.removeItem('token');
};
export const setCollege = (data) => api.post('auth/set_college/', data);
export const forgotPassword = (data) => api.post('auth/forgot_password/', data);
export const resetPassword = (data) => api.post('auth/reset_password/', data);
