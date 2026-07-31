/**
 * api.js — central Axios instance
 * ─────────────────────────────────────────────────────────────────────────────
 * Token is stored in module-level memory (NOT localStorage) so it cannot
 * be stolen by XSS.  AuthContext calls setApiToken() after login / refresh
 * and registerRefreshFn() to register its silentRefresh callback.
 */
import axios from 'axios';

const normalizeBaseUrl = (url) => {
  if (!url || typeof url !== 'string') return 'http://localhost:5000/api';
  const trimmed = url.trim();
  if (trimmed.startsWith(':')) {
    return `http://localhost${trimmed}`;
  }
  if (!/^https?:\/\//i.test(trimmed)) {
    return `http://${trimmed}`;
  }
  return trimmed.replace(/\/$/, '');
};

const API_BASE_URL = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api');

let _token      = null;
let _refreshFn  = null;
let _logoutFn   = null;

/** Called by AuthContext after login or silent refresh */
export const setApiToken   = (token) => { _token = token; };
export const clearApiToken = ()      => { _token = null; };

/** Called by AuthContext on mount to register silentRefresh + logout */
export const registerAuthCallbacks = (refreshFn, logoutFn) => {
    _refreshFn = refreshFn;
    _logoutFn  = logoutFn;
};

const api = axios.create({
    baseURL:         API_BASE_URL,
    withCredentials: true, // send httpOnly refresh-token cookie automatically
    headers: { 'Content-Type': 'application/json' }
});

// ── Request interceptor: attach access token ──────────────────────────────────
api.interceptors.request.use(
    (config) => {
        if (_token) {
            config.headers['x-auth-token'] = _token;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ── Response interceptor: auto-refresh on any 401 ────────────────────────────
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const original = error.config;

        // Attempt a silent refresh on any 401 (whether the server sends a
        // TOKEN_EXPIRED code or a plain "No token / invalid token" message),
        // but only once per request and only if we have a refresh function.
        const shouldRefresh =
            error.response?.status === 401 &&
            !original._retry &&
            _refreshFn;

        if (shouldRefresh) {
            original._retry = true;
            try {
                const newToken = await _refreshFn();
                if (newToken) {
                    original.headers['x-auth-token'] = newToken;
                    return api(original); // retry original request with new token
                } else {
                    // Refresh returned null — session is dead
                    if (_logoutFn) _logoutFn();
                }
            } catch {
                // Refresh threw — log the user out
                if (_logoutFn) _logoutFn();
            }
        }

        // Hard 401 after retry failed — clear session
        if (error.response?.status === 401 && original._retry) {
            if (_logoutFn) _logoutFn();
        }

        return Promise.reject(error);
    }
);

export default api;
