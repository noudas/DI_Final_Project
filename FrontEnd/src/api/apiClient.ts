import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://di-final-project-backend.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptors if needed for handling tokens or errors
apiClient.interceptors.request.use(
  (config) => {
    // Example: Attach token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
