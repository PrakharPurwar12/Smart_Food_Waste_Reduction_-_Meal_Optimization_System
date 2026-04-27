import api from './api';

export const getPredictions = () => api.get('predictions/');
export const getStats = () => api.get('predictions/stats/');
