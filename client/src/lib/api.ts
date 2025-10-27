import axios from "axios";

export const API_BASE = import.meta.env.VITE_API_URL || "https://cashorcras-backend.onrender.com";

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // Important for session management
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toLowerCase()} request to: ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`Response from ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    console.error(`API Error for ${error.config?.url}:`, error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export default api;

// Legacy function for backward compatibility
export async function apiFetch(path: string, init?: RequestInit) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    ...init,
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}
