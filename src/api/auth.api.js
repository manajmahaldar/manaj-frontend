/**
 * auth.api.js
 * All endpoints under /api/auth
 */
import api from './axios.js';

// ─── Register ─────────────────────────────────────────────────────────────────
// POST /api/auth/register
export const register = (data) => api.post('/auth/register', data);

// ─── Login ────────────────────────────────────────────────────────────────────
// POST /api/auth/login
export const login = (data) => api.post('/auth/login', data);

// ─── Google OAuth Login ───────────────────────────────────────────────────────
// POST /api/auth/google-login
export const googleLogin = (data) => api.post('/auth/google-login', data);

// ─── Refresh Token ────────────────────────────────────────────────────────────
// POST /api/auth/refresh-token  (uses httpOnly cookie — no body needed)
export const refreshToken = () => api.post('/auth/refresh-token');

// ─── Logout ───────────────────────────────────────────────────────────────────
// POST /api/auth/logout  (Protected)
export const logout = () => api.post('/auth/logout');

// ─── Forgot Password ──────────────────────────────────────────────────────────
// POST /api/auth/forgot-password  { email }
export const forgotPassword = (data) => api.post('/auth/forgot-password', data);

// ─── Reset Password ───────────────────────────────────────────────────────────
// POST /api/auth/reset-password/:token  { password }
export const resetPassword = (token, data) =>
  api.post(`/auth/reset-password/${token}`, data);
