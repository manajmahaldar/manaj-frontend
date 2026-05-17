/**
 * useAuth.js
 * Convenience hook — gives any component access to AuthContext.
 *
 * Usage:
 *   const { user, login, logout, updateUser, loading } = useAuth();
 */
import { useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return context;
};

export default useAuth;
