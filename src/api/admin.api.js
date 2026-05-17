/**
 * admin.api.js
 * All endpoints under /api/admin
 */
import api from './axios.js';

// ─── Dashboard Stats ──────────────────────────────────────────────────────────
// GET /api/admin/stats
export const getAdminStats = () => api.get('/admin/stats');

// ─── All Users ────────────────────────────────────────────────────────────────
// GET /api/admin/users
export const getAllUsers = () => api.get('/admin/users');

// ─── Pending Verification Users ───────────────────────────────────────────────
// GET /api/admin/pending-users
export const getPendingUsers = () => api.get('/admin/pending-users');

// ─── Approve User Verification ────────────────────────────────────────────────
// PUT /api/admin/users/:id/approve-verification
export const approveUserVerification = (id) =>
  api.put(`/admin/users/${id}/approve-verification`);

// ─── Reject User Verification ─────────────────────────────────────────────────
// PUT /api/admin/users/:id/reject-verification  { reason? }
export const rejectUserVerification = (id, reason) =>
  api.put(`/admin/users/${id}/reject-verification`, { reason });

// ─── Verify User (legacy) ─────────────────────────────────────────────────────
// PUT /api/admin/users/:id/verify
export const verifyUser = (id) => api.put(`/admin/users/${id}/verify`);

// ─── Update User Status (Suspend / Activate) ─────────────────────────────────
// PUT /api/admin/users/:id/status  { accountStatus: 'active' | 'suspended' }
export const updateUserStatus = (id, accountStatus) =>
  api.put(`/admin/users/${id}/status`, { accountStatus });

// ─── Delete User ──────────────────────────────────────────────────────────────
// DELETE /api/admin/users/:id
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);

// ─── Pending Listings & Buying Posts ─────────────────────────────────────────
// GET /api/admin/pending-listings  (returns combined array with `type` field)
export const getPendingListings = () => api.get('/admin/pending-listings');

// ─── Approve Listing ──────────────────────────────────────────────────────────
// PUT /api/admin/listings/:id/approve
export const approveListing = (id) => api.put(`/admin/listings/${id}/approve`);

// ─── Reject Listing ───────────────────────────────────────────────────────────
// PUT /api/admin/listings/:id/reject
export const rejectListing = (id) => api.put(`/admin/listings/${id}/reject`);

// ─── Approve Buying Post ──────────────────────────────────────────────────────
// PUT /api/admin/posts/:id/approve
export const approveBuyingPost = (id) => api.put(`/admin/posts/${id}/approve`);

// ─── Reject Buying Post ───────────────────────────────────────────────────────
// PUT /api/admin/posts/:id/reject
export const rejectBuyingPost = (id) => api.put(`/admin/posts/${id}/reject`);

// ─── Submit Report ────────────────────────────────────────────────────────────
// POST /api/admin  { targetId, type, reason }
export const submitReport = (data) => api.post('/admin', data);
