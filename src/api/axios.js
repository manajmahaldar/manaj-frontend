import axios from 'axios';

// ─── Base Instance ────────────────────────────────────────────────────────────
// NOTE: This instance is used by api/auth.api.js for the raw auth endpoints
// (login, register, refresh-token, logout).  All other app API calls should
// go through utils/api.js which carries the in-memory access token.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  withCredentials: true, // send httpOnly refresh-token cookie automatically
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request Interceptor — attach access token ────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token; // matches backend auth middleware
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor — auto-refresh on 401 ───────────────────────────────
// This interceptor only handles requests that come through THIS axios instance
// (i.e., auth API calls in api/auth.api.js).  Most app requests use utils/api.js
// which has its own refresh logic integrated with AuthContext.
let isRefreshing = false;
let failedQueue  = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only attempt refresh on 401, and only once per request
    if (error.response?.status === 401 && !originalRequest._retry) {
      // If a refresh is already in progress, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['x-auth-token'] = token;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to get a new access token via the httpOnly refresh-token cookie
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        const newToken = data.token;
        localStorage.setItem('token', newToken);
        api.defaults.headers.common['x-auth-token'] = newToken;
        processQueue(null, newToken);

        originalRequest.headers['x-auth-token'] = newToken;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Clear stale token from localStorage — but do NOT force a redirect here.
        // AuthContext's bootstrap or the utils/api.js interceptor will handle
        // routing to /login when appropriate.  A hard redirect here would bypass
        // React Router and break the app state.
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
