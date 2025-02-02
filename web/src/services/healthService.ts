import apiClient from './apiClient';

export async function healthCheck() {
  const response = await apiClient.get('/health');
  return response.data;
};
