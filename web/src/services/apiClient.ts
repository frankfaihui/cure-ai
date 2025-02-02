import axios from 'axios';
import { API_BASE_URL } from '@/config';

// Create an Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL
});

// Add an interceptor to include the Authorization header in all requests
apiClient.interceptors.request.use(
  async (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;