import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Generic CRUD helpers
export const getAll = (table, params) => api.get(`/${table}`, { params });
export const getOne = (table, id) => api.get(`/${table}/${id}`);
export const createOne = (table, data) => api.post(`/${table}`, data);
export const updateOne = (table, id, data) => api.put(`/${table}/${id}`, data);
export const deleteOne = (table, id) => api.delete(`/${table}/${id}`);

export default api;
