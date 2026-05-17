/**
 * useUsers.js
 * Hook for user profile management (update profile, upload picture, verify).
 *
 * Usage:
 *   const { updating, uploadPicture, updateProfile, submitVerification } = useUsers();
 */
import { useState } from 'react';
import toast from 'react-hot-toast';
import useAuth from './useAuth.js';
import * as userService from '../services/user.service.js';

const useUsers = () => {
  const { updateUser } = useAuth();
  const [updating, setUpdating] = useState(false);
  const [error,    setError]    = useState(null);

  // ─── Upload Profile Picture ───────────────────────────────────────────────
  const uploadPicture = async (imageFile) => {
    setUpdating(true);
    setError(null);
    try {
      const res = await userService.uploadProfilePicture(imageFile);
      // Patch just the profilePicture field in auth context
      updateUser((prev) => ({ ...prev, profilePicture: res.profilePicture }));
      toast.success('Profile picture updated!');
      return res;
    } catch (err) {
      const msg = err?.response?.data?.msg || 'Upload failed';
      setError(msg);
      toast.error(msg);
      throw err;
    } finally {
      setUpdating(false);
    }
  };

  // ─── Update Profile ───────────────────────────────────────────────────────
  const updateProfile = async (fields) => {
    setUpdating(true);
    setError(null);
    try {
      const res = await userService.updateProfile(fields);
      updateUser(res.user);
      toast.success('Profile updated!');
      return res;
    } catch (err) {
      const msg = err?.response?.data?.msg || 'Update failed';
      setError(msg);
      toast.error(msg);
      throw err;
    } finally {
      setUpdating(false);
    }
  };

  // ─── Submit Verification Documents ───────────────────────────────────────
  const submitVerification = async (params) => {
    setUpdating(true);
    setError(null);
    try {
      const res = await userService.submitVerificationDocs(params);
      updateUser(res.user);
      toast.success('Verification submitted! Await admin review.');
      return res;
    } catch (err) {
      const msg = err?.response?.data?.msg || 'Submission failed';
      setError(msg);
      toast.error(msg);
      throw err;
    } finally {
      setUpdating(false);
    }
  };

  return {
    updating,
    error,
    uploadPicture,
    updateProfile,
    submitVerification,
  };
};

export default useUsers;
