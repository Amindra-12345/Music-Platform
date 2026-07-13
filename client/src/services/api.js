import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

// Inject your locally cached web tokens into headers automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const loginUser = (formData) => API.post('/auth/login', formData);
export const registerUser = (formData) => API.post('/auth/register', formData);
export const fetchTracks = () => API.get('/tracks');
export const uploadTrackFile = (formData) => API.post('/tracks/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});