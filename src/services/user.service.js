/**
 * user.service.js
 * Business-logic wrapper around user.api.js.
 */
import * as userApi from '../api/user.api.js';

// ─── Upload Profile Picture ───────────────────────────────────────────────────
// @param {File} imageFile
// Returns { msg, profilePicture }
export const uploadProfilePicture = async (imageFile) => {
  const { data } = await userApi.uploadProfilePicture(imageFile);
  return data;
};

// ─── Update Profile ───────────────────────────────────────────────────────────
// @param {{ name?, district?, phone? }} fields
// Returns { msg, user }
export const updateProfile = async (fields) => {
  const { data } = await userApi.updateProfile(fields);
  return data;
};

// ─── Submit Verification Documents ───────────────────────────────────────────
// @param {{ name?, email?, phone?, aadhaar: File, video: File }} params
// Returns { msg, user }
export const submitVerificationDocs = async (params) => {
  const { data } = await userApi.submitVerificationDocs(params);
  return data;
};
