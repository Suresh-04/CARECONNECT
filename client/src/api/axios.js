import axios from 'axios';
import { supabase } from '../config/supabaseClient';

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';

const apiClient = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
});

// Request Interceptor: Attach Supabase JWT Bearer token if session exists
apiClient.interceptors.request.use(
  async (requestConfig) => {
    try {
      if (supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          requestConfig.headers.Authorization = `Bearer ${session.access_token}`;
        }
      }
    } catch (err) {
      console.warn('[CARECONNECT] Could not attach Supabase auth token:', err.message);
    }
    return requestConfig;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Uniform error formatting
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorDetails = {
      message: error.response?.data?.message || error.message || 'An unexpected network error occurred',
      status: error.response?.status,
      data: error.response?.data,
      isNetworkError: !error.response
    };
    return Promise.reject(errorDetails);
  }
);

export default apiClient;

