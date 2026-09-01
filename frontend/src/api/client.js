import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000, // 10s timeout
  headers: {
    'Content-Type': 'application/json'
  }
});

// Response interceptor to format responses or handle global errors
client.interceptors.response.use(
  (response) => {
    // Standardize response extraction if it comes wrapped in `data` from backend
    return response.data;
  },
  (error) => {
    console.error('API Error:', error.response?.data?.message || error.message);
    return Promise.reject(error);
  }
);

export default client;
