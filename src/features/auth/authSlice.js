/**
 * features/auth/authSlice.js
 * Redux slice for all authentication state.
 *
 * State shape:
 * {
 *   user:    object | null,
 *   token:   string | null,
 *   loading: boolean,
 *   error:   string | null,
 * }
 */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { setApiToken, clearApiToken } from '../../utils/api.js';
import * as authApi from './api/auth.api.js';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const persistUser  = (user)  => localStorage.setItem('user',  JSON.stringify(user));
const clearStorage = ()      => localStorage.removeItem('user');
const loadUser     = ()      => {
  try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
};

// ─── Async Thunks ─────────────────────────────────────────────────────────────

export const registerUser = createAsyncThunk(
  'auth/register',
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await authApi.register(formData);
      return data; // { token, user }
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || 'Registration failed');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ phone, password }, { rejectWithValue }) => {
    try {
      const { data } = await authApi.login({ phone, password });
      return data; // { token, user }
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || 'Login failed');
    }
  }
);

export const googleLoginUser = createAsyncThunk(
  'auth/googleLogin',
  async (credential, { rejectWithValue }) => {
    try {
      const { data } = await authApi.googleLogin({ credential });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || 'Google login failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logout();
    } catch {
      // Best-effort — clear client state regardless
    }
  }
);

export const forgotPasswordThunk = createAsyncThunk(
  'auth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      const { data } = await authApi.forgotPassword({ email });
      return data.msg;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || 'Request failed');
    }
  }
);

export const resetPasswordThunk = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, password }, { rejectWithValue }) => {
    try {
      const { data } = await authApi.resetPassword(token, { password });
      return data.msg;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || 'Reset failed');
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user:    loadUser(),   // hydrate from localStorage on boot
    token:   null,
    loading: false,
    error:   null,
  },

  reducers: {
    // Called by AuthContext after a successful silent refresh
    setCredentials(state, { payload: { token, user } }) {
      state.token = token;
      if (user) state.user = user;
      setApiToken(token);
      if (user) persistUser(user);
    },

    // Update profile fields without re-login
    updateUserProfile(state, { payload }) {
      state.user = { ...state.user, ...payload };
      persistUser(state.user);
    },

    clearError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    // ── Register ───────────────────────────────────────────────────────────
    builder
      .addCase(registerUser.pending,  (state) => { state.loading = true;  state.error = null; })
      .addCase(registerUser.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user    = payload.user;
        state.token   = payload.token;
        setApiToken(payload.token);
        persistUser(payload.user);
      })
      .addCase(registerUser.rejected, (state, { payload }) => {
        state.loading = false;
        state.error   = payload;
      });

    // ── Login ──────────────────────────────────────────────────────────────
    builder
      .addCase(loginUser.pending,  (state) => { state.loading = true;  state.error = null; })
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user    = payload.user;
        state.token   = payload.token;
        setApiToken(payload.token);
        persistUser(payload.user);
      })
      .addCase(loginUser.rejected, (state, { payload }) => {
        state.loading = false;
        state.error   = payload;
      });

    // ── Google Login ───────────────────────────────────────────────────────
    builder
      .addCase(googleLoginUser.pending,  (state) => { state.loading = true;  state.error = null; })
      .addCase(googleLoginUser.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user    = payload.user;
        state.token   = payload.token;
        setApiToken(payload.token);
        persistUser(payload.user);
      })
      .addCase(googleLoginUser.rejected, (state, { payload }) => {
        state.loading = false;
        state.error   = payload;
      });

    // ── Logout ─────────────────────────────────────────────────────────────
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user  = null;
      state.token = null;
      clearApiToken();
      clearStorage();
    });

    // ── Forgot / Reset Password ────────────────────────────────────────────
    builder
      .addCase(forgotPasswordThunk.pending,  (state) => { state.loading = true;  state.error = null; })
      .addCase(forgotPasswordThunk.fulfilled, (state) => { state.loading = false; })
      .addCase(forgotPasswordThunk.rejected,  (state, { payload }) => { state.loading = false; state.error = payload; });

    builder
      .addCase(resetPasswordThunk.pending,  (state) => { state.loading = true;  state.error = null; })
      .addCase(resetPasswordThunk.fulfilled, (state) => { state.loading = false; })
      .addCase(resetPasswordThunk.rejected,  (state, { payload }) => { state.loading = false; state.error = payload; });
  },
});

export const { setCredentials, updateUserProfile, clearError } = authSlice.actions;

// ─── Selectors ────────────────────────────────────────────────────────────────
export const selectCurrentUser    = (state) => state.auth.user;
export const selectAuthToken      = (state) => state.auth.token;
export const selectAuthLoading    = (state) => state.auth.loading;
export const selectAuthError      = (state) => state.auth.error;
export const selectIsAuthenticated = (state) => Boolean(state.auth.user);
export const selectUserRole       = (state) => state.auth.user?.role ?? null;

export default authSlice.reducer;
