/**
 * auth.service.js
 * Business-logic wrapper around auth.api.js.
 * Components / hooks call this layer; raw API calls stay in api/.
 */
import * as authApi from '../api/auth.api.js';

// ─── Register ─────────────────────────────────────────────────────────────────
// Returns { token, user }
export const register = async ({ name, phone, email, password, role, district }) => {
  const { data } = await authApi.register({ name, phone, email, password, role, district });
  return data; // { token, user }
};

// ─── Login ────────────────────────────────────────────────────────────────────
// Returns { token, user }
export const login = async ({ phone, password }) => {
  const { data } = await authApi.login({ phone, password });
  return data; // { token, user }
};

// ─── Google Login ─────────────────────────────────────────────────────────────
// @param {string} credential — Google ID token from @react-oauth/google
// Returns { token, user }
export const googleLogin = async (credential) => {
  const { data } = await authApi.googleLogin({ credential });
  return data;
};

// ─── Logout ───────────────────────────────────────────────────────────────────
export const logout = async () => {
  try {
    await authApi.logout();
  } catch {
    // Best-effort — always clear client state
  }
};

// ─── Forgot Password ──────────────────────────────────────────────────────────
// @param {string} email
export const forgotPassword = async (email) => {
  const { data } = await authApi.forgotPassword({ email });
  return data;
};

// ─── Reset Password ───────────────────────────────────────────────────────────
// @param {string} token  — from email link
// @param {string} password — new password
export const resetPassword = async (token, password) => {
  const { data } = await authApi.resetPassword(token, { password });
  return data;
};

// ─── Silent Refresh ───────────────────────────────────────────────────────────
// Used by AuthContext on boot — returns new access token string or null
export const silentRefresh = async () => {
  try {
    const { data } = await authApi.refreshToken();
    return data.token ?? null;
  } catch {
    return null;
  }
};
