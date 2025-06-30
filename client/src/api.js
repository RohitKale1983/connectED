// client/src/api/index.js (or client/src/api.js)
import axios from 'axios';

// Determine the API base URL based on the environment
// Vercel sets NODE_ENV to 'production' during deployment
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://connected-backend-6yoi.onrender.com' // Your deployed Render backend URL
  : 'http://localhost:5000'; // Your local backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for sending cookies/auth headers if used
});

// Add a request interceptor to attach the authentication token
// This ensures all requests made with 'api' instance automatically include the token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;