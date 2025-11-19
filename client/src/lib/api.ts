import axios, { type AxiosRequestConfig } from "axios";

// Ensure we always use the backend URL, never relative URLs
export const API_BASE = import.meta.env.VITE_API_URL || "https://cashorcras-backend.onrender.com";

// Remove trailing slash if present
const normalizedBaseURL = API_BASE.replace(/\/$/, "");

console.log("[api] Initializing axios with baseURL:", normalizedBaseURL);

const api = axios.create({
  baseURL: normalizedBaseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// CRITICAL: Request interceptor to include admin code in headers
// This MUST run before the request is sent
api.interceptors.request.use(
  (config) => {
    // Read admin code from localStorage
    const adminCode = localStorage.getItem("adminCode");
    
    // Always set the header if adminCode exists (for all requests)
    if (adminCode && config.headers) {
      // Explicitly set the header - use both lowercase and ensure it's set
      config.headers["x-admin-code"] = adminCode;
      config.headers["X-Admin-Code"] = adminCode; // Also set uppercase for compatibility
      
      console.log(`[api] ✅ x-admin-code header SET for ${config.method?.toUpperCase()} ${config.url}`);
      console.log(`[api] Header value: ${adminCode.substring(0, 3)}... (length: ${adminCode.length})`);
    } else if (!adminCode) {
      // Log warning for admin routes without code
      if (config.url?.includes('/admin') || config.url?.includes('/api/admin')) {
        console.warn(`[api] ⚠️ Admin request detected but NO adminCode in localStorage: ${config.method?.toUpperCase()} ${config.url}`);
        console.warn(`[api] localStorage.getItem('adminCode'):`, localStorage.getItem("adminCode"));
      }
    }
    
    // Log the final headers being sent (sanitized)
    if (config.headers) {
      const headerKeys = Object.keys(config.headers);
      console.log(`[api] Request headers:`, headerKeys.join(", "));
    }
    
    return config;
  },
  (error) => {
    console.error("[api] Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Request interceptor for debugging URL construction
api.interceptors.request.use(
  (config) => {
    const fullURL = `${config.baseURL || ""}${config.url || ""}`;
    console.log(`[api] 🌐 ${config.method?.toUpperCase()} request to: ${fullURL}`);
    console.log(`[api] Base URL: ${config.baseURL}`);
    console.log(`[api] Request URL: ${config.url}`);
    return config;
  },
  (error) => {
    console.error("[api] URL interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and debugging
api.interceptors.response.use(
  (response) => {
    console.log(`✅ Response from ${response.config.url}:`, response.status, response.statusText);
    if (response.config.url?.includes('/admin')) {
      console.log(`✅ Admin request succeeded: ${response.config.method?.toUpperCase()} ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    const url = error.config?.url || "unknown";
    const status = error.response?.status;
    const statusText = error.response?.statusText;
    const data = error.response?.data;
    
    console.error(`❌ API Error for ${url}:`, status, statusText);
    console.error(`❌ Error data:`, data);
    
    // Special handling for 403 errors (admin authentication failures)
    if (status === 403 && url?.includes('/admin')) {
      console.error(`❌ CRITICAL: Admin request blocked (403)`);
      console.error(`❌ Request URL: ${error.config?.baseURL}${url}`);
      console.error(`❌ Request method: ${error.config?.method}`);
      console.error(`❌ Request headers sent:`, error.config?.headers ? Object.keys(error.config.headers).join(", ") : "none");
      
      // Check if adminCode exists in localStorage
      const adminCode = localStorage.getItem("adminCode");
      if (!adminCode) {
        console.error(`❌ CRITICAL: No adminCode in localStorage! This is why the request failed.`);
        console.error(`❌ localStorage keys:`, Object.keys(localStorage).join(", "));
      } else {
        console.error(`❌ adminCode exists in localStorage (length: ${adminCode.length})`);
        console.error(`❌ adminCode value (first 3 chars): ${adminCode.substring(0, 3)}...`);
      }
    }
    
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
