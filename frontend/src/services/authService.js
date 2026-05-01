import api from './api';

export const login = (credentials) => api.post('auth/login/', credentials);
export const register = (data) => api.post('auth/register/', data);
export const logout = () => {
  localStorage.removeItem('token');
};
export const setCollege = (data) => api.post('users/set-college/', data);
