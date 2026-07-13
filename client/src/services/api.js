import axios from 'axios';

const API = axios.create({
  baseURL: '', // Vite proxy handles routing path requests automatically
});

// Automatically inject JWT token into authorization headers if saved locally
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Explicitly export all functions used by App.jsx
export const loginUser = (data) => API.post('/api/auth/login', data);
export const registerUser = (data) => API.post('/api/auth/register', data);
export const fetchTracks = () => API.get('/api/tracks');
export const uploadTrackFile = (formData) => API.post('/api/tracks/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

export default API;