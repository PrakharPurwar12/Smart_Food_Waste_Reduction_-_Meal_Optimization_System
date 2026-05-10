import api from './api';

export const getPredictions = () => api.get('predictions/');
export const generatePrediction = (data) => api.post('predictions/generate/', data);
export const updateActualCount = (id, data) => api.post(`predictions/${id}/update_actual/`, data);
export const getStats = () => api.get('predictions/stats/');
export const getPredictionAnalytics = (range = 30) =>
  api.get('predictions/analytics/', { params: { range } });
