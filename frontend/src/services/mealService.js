import api from './api';

export const bookMeal = (data) => api.post('meals/book/', data);

export const getMyBookings = (date) => api.get('meals/my_bookings/', { params: { date } });

export const cancelBooking = (id) => api.patch(`meals/${id}/cancel/`);

export const getAllBookings = (date) => api.get('meals/all_bookings/', { params: { date } });

export const getMealStats = (date) => api.get('meals/stats/', { params: { date } });

// Menu Services
export const getTodayMenu = (date) => api.get('meals/menu/today/', { params: { date } });

export const uploadMenu = (data) => api.post('meals/menu/', data);

export const mealService = {
  bookMeal,
  getMyBookings,
  cancelBooking,
  getAllBookings,
  getMealStats,
  getTodayMenu,
  uploadMenu
};

export default mealService;
