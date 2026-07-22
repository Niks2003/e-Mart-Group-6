import axios from 'axios';

/**
 * axiosConfig.js
 * ------------------------------------------------------------------
 * Central axios instance used by every API call in the app.
 *
 * - Base URL is read from an environment variable so it can be
 *   changed per-environment (dev/staging/prod) without touching code.
 * - A request interceptor automatically attaches the JWT as
 *   "Authorization: Bearer <token>" on every outgoing request.
 * - A response interceptor watches for 401 Unauthorized responses
 *   (expired/invalid token) and forces a clean logout + redirect
 *   to /login, so the user is never stuck with a dead session.
 * ------------------------------------------------------------------
 */

// Storage keys are centralized here so AuthContext and this file
// never drift out of sync with each other.
export const TOKEN_KEY = 'emart_token';
export const USER_KEY = 'emart_user';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Request interceptor: attach JWT automatically -------------------
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- Response interceptor: handle 401 Unauthorized globally ---------
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error.config?.url || '';

    // IMPORTANT: a bad email/password on POST /api/auth/login also comes
    // back as 401 (Spring Security's AuthenticationException, thrown by
    // authenticationManager.authenticate() inside AuthServiceImpl, is
    // translated to 401 automatically). That is a normal "wrong
    // credentials" case that Login.jsx needs to catch and display inline
    // - it is NOT an expired-session case, so we must not force-redirect
    // or wipe storage for it.
    const isAuthEndpoint = requestUrl.includes('/api/auth/');

    if (error.response && error.response.status === 401 && !isAuthEndpoint) {
      // Token missing/expired/rejected by backend on a protected route
      // -> force clean logout.
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);

      // Avoid a redirect loop if we are already on the login page.
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
