/**
 * user.api.js
 * All endpoints under /api/users
 */
import api from './axios.js';

// ─── Upload Profile Picture ───────────────────────────────────────────────────
// POST /api/users/profile-picture  (multipart/form-data — field: "image")
// @param {File} imageFile — the image File object
export const uploadProfilePicture = (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  return api.post('/users/profile-picture', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// ─── Update Profile ───────────────────────────────────────────────────────────
// PUT /api/users/profile  { name?, district?, phone? }
export const updateProfile = (data) => api.put('/users/profile', data);

// ─── Submit Verification Documents ───────────────────────────────────────────
// PUT /api/users/verify-profile  (multipart/form-data — fields: "aadhaar", "video")
// @param {Object} fields — { name?, email?, phone?, aadhaar: File, video: File }
export const submitVerificationDocs = ({ name, email, phone, aadhaar, video }) => {
  const formData = new FormData();
  if (name)    formData.append('name', name);
  if (email)   formData.append('email', email);
  if (phone)   formData.append('phone', phone);
  if (aadhaar) formData.append('aadhaar', aadhaar);
  if (video)   formData.append('video', video);
  return api.put('/users/verify-profile', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
