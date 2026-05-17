/**
 * features/auth/hooks/useAuthSlice.js
 * Hook that gives components clean access to auth Redux state + thunks.
 *
 * Usage:
 *   const { user, loading, error, login, logout, register } = useAuthSlice();
 */
import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import {
  selectCurrentUser,
  selectAuthLoading,
  selectAuthError,
  selectIsAuthenticated,
  selectUserRole,
  loginUser,
  registerUser,
  googleLoginUser,
  logoutUser,
  forgotPasswordThunk,
  resetPasswordThunk,
  clearError,
  updateUserProfile,
} from '../authSlice.js';

const useAuthSlice = () => {
  const dispatch = useDispatch();

  const user            = useSelector(selectCurrentUser);
  const loading         = useSelector(selectAuthLoading);
  const error           = useSelector(selectAuthError);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const role            = useSelector(selectUserRole);

  const login         = useCallback((creds)           => dispatch(loginUser(creds)),          [dispatch]);
  const register      = useCallback((form)            => dispatch(registerUser(form)),         [dispatch]);
  const googleLogin   = useCallback((credential)      => dispatch(googleLoginUser(credential)),[dispatch]);
  const logout        = useCallback(()                => dispatch(logoutUser()),               [dispatch]);
  const forgotPwd     = useCallback((email)           => dispatch(forgotPasswordThunk(email)), [dispatch]);
  const resetPwd      = useCallback((token, password) => dispatch(resetPasswordThunk({ token, password })), [dispatch]);
  const patchUser     = useCallback((fields)          => dispatch(updateUserProfile(fields)),  [dispatch]);
  const dismissError  = useCallback(()                => dispatch(clearError()),               [dispatch]);

  return {
    // State
    user,
    loading,
    error,
    isAuthenticated,
    role,
    // Actions
    login,
    register,
    googleLogin,
    logout,
    forgotPwd,
    resetPwd,
    patchUser,
    dismissError,
  };
};

export default useAuthSlice;
