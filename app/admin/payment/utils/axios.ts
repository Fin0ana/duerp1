import axios, { AxiosRequestConfig } from 'axios';

// Create an axios instance
const axiosInstance = axios.create({
  baseURL: 'https://back-duerp.vercel.app',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add a request interceptor to attach the token to every request
axiosInstance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = localStorage.getItem('authToken');  // Get token from localStorage
    if (token) {
      config.headers['x-access-token'] = token;  // Attach token to Authorization header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;