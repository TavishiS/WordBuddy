import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.29.99:8000/', // your Django backend
  headers: {
    'Content-Type': 'application/json',
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export default api;
