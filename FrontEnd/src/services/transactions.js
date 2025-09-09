import api from '@/utils/api';
export const getTransactions = (params) => api.get('/transactions', { params });
