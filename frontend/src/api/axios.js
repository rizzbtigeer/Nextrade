// src/api/axios.js
import axios from 'axios';
import { ADMIN_BASE_PATH } from '../config.js';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur pour ajouter le token
api.interceptors.request.use(
  (config) => {
    try {
      const adminData = localStorage.getItem('gros237_admin');
      if (adminData) {
        const parsed = JSON.parse(adminData);
        if (parsed.token) {
          config.headers.Authorization = `Bearer ${parsed.token}`;
        }
      }
    } catch (error) {
      console.error('Erreur token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour gérer les erreurs 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('gros237_admin');
      const loginPath = `/${ADMIN_BASE_PATH}/login`;
      if (!window.location.pathname.includes(loginPath)) {
        window.location.href = loginPath;
      }
    }
    return Promise.reject(error);
  }
);

export default api;