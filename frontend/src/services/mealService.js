import api from './api';

export const bookMeal = (data) =>
  api.post('meals/bookings/book/', data);

export const getMyBookings = (date) =>
  api.get('meals/bookings/my_bookings/', { params: { date } });

export const cancelBooking = (id) =>
  api.patch(`meals/bookings/${id}/cancel/`);

export const getAllBookings = (date) =>
  api.get('meals/bookings/all_bookings/', { params: { date } });

export const getMealStats = (date) =>
  api.get('meals/bookings/stats/', { params: { date } });

export const getTodayMenu = (date) =>
  api.get('meals/menu/today/', { params: { date } });

export const uploadMenu = (data) =>
  api.post('meals/menu/', data);

// ✅ New rotating menu calls
export const getRotatingMenuToday = () =>
  api.get('meals/rotating/today/');

export const getFullSchedule = () =>
  api.get('meals/rotating/schedule/');

const mealService = {
  bookMeal,
  getMyBookings,
  cancelBooking,
  getAllBookings,
  getMealStats,
  getTodayMenu,
  uploadMenu,
  getRotatingMenuToday,
  getFullSchedule,
};

export default mealService;