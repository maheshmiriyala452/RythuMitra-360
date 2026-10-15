import axios from 'axios';

// Central Axios API Client
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Response interceptor for unified error formatting
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let errorMessage = 'An unexpected server error occurred.';
    if (error.response) {
      // The server responded with a status outside of 2xx
      errorMessage = error.response.data?.message || `Server responded with status ${error.response.status}`;
    } else if (error.request) {
      // The request was made but no response was received (e.g. JSON server is down)
      errorMessage = 'Cannot connect to backend server. Make sure JSON Server is running on port 5001.';
    } else {
      errorMessage = error.message;
    }
    return Promise.reject(new Error(errorMessage));
  }
);

export default api;
