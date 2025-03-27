import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.VITE_BACKEND_API_URL || 'http://localhost:8000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    ...(typeof window === 'undefined' && { 'User-Agent': 's@gmail.com' }) // Only add User-Agent in non-browser environments
  },
});

apiClient.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default apiClient;
