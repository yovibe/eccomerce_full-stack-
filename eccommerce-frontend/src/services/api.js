import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Automatically attach JWT token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global error handling for 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token');
      // For a non-React-Router driven redirect we can use window.location
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
