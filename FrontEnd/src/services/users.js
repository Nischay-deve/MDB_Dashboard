import api from '@/utils/api';
export const getUsers = (params) => api.get('/auth/list', { params });
