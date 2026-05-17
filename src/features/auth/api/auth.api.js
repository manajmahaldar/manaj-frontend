/**
 * features/auth/api/auth.api.js
 * Raw HTTP calls for /api/auth — used only by authSlice thunks.
 * Re-exports from the shared api layer to keep one source of truth.
 */
export {
  register,
  login,
  googleLogin,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
} from '../../../api/auth.api.js';
