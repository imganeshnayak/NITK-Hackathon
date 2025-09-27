// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // The proxy will handle the rest
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
});

export default api;