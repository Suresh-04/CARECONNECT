import apiClient from './axios';

export async function fetchBackendHealth() {
  try {
    const response = await apiClient.get('/health');
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to connect to CARECONNECT backend'
    };
  }
}

export async function fetchBackendPing() {
  try {
    const response = await apiClient.get('/ping');
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

