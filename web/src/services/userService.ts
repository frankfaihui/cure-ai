import apiClient from './apiClient';

export async function fetchUsers() {
  const response = await apiClient.get('/health');
  return response.data;
};
