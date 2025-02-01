import axios from 'axios';
// import { fetchAuthSession } from 'aws-amplify/auth';
import { API_BASE_URL } from '@/config';


// Function to fetch and return the auth token
// const getAuthToken = async (): Promise<string | null> => {
//   try {
//     const session = await fetchAuthSession();
//     return session.tokens?.accessToken.toString() || null;
//   } catch (error) {
//     console.error("Error fetching auth token:", error);
//     return null;
//   }
// };

// Create an Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL
});

// Add an interceptor to include the Authorization header in all requests
apiClient.interceptors.request.use(
  async (config) => {
    // const token = await getAuthToken();
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;