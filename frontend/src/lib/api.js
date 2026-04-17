import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://10.0.0.176:8000',   // <-- use your Zephyrus backend IP
});

// Automatically attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('gp_share_token');  // <-- your existing key
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
