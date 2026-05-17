/**
 * product.api.js
 * All endpoints under /api/listings  and  /api/posts (buying posts)
 *
 * "Listings" = sell-side fish listings (Farmer / Seller / Hatchery)
 * "Posts"    = buy-side buying posts   (Trader)
 */
import api from './axios.js';

// ═══════════════════════════════════════════════════════════════
//  LISTINGS  (/api/listings)
// ═══════════════════════════════════════════════════════════════

// ─── Create Listing ───────────────────────────────────────────
// POST /api/listings  (multipart/form-data — up to 3 photos)
// @param {Object} fields   — all listing fields
// @param {File[]} photos   — array of image Files (max 3)
export const createListing = (fields, photos = []) => {
  const formData = new FormData();
  Object.entries(fields).forEach(([key, val]) => {
    if (val !== undefined && val !== null) formData.append(key, val);
  });
  photos.forEach((photo) => formData.append('photos', photo));
  return api.post('/listings', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// ─── Get All Approved Listings ────────────────────────────────
// GET /api/listings
export const getListings = () => api.get('/listings');

// ─── Get My Listings ──────────────────────────────────────────
// GET /api/listings/my-listings
export const getMyListings = () => api.get('/listings/my-listings');

// ─── Update Listing ───────────────────────────────────────────
// PUT /api/listings/:id  (multipart/form-data — up to 3 photos)
// @param {string} id
// @param {Object} fields
// @param {File[]} photos
export const updateListing = (id, fields, photos = []) => {
  const formData = new FormData();
  Object.entries(fields).forEach(([key, val]) => {
    if (val !== undefined && val !== null) formData.append(key, val);
  });
  photos.forEach((photo) => formData.append('photos', photo));
  return api.put(`/listings/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// ─── Delete Listing ───────────────────────────────────────────
// DELETE /api/listings/:id
export const deleteListing = (id) => api.delete(`/listings/${id}`);

// ─── Update Listing Status (Admin) ───────────────────────────
// PUT /api/listings/:id/status  { status: 'approved' | 'rejected' }
export const updateListingStatus = (id, status) =>
  api.put(`/listings/${id}/status`, { status });


// ═══════════════════════════════════════════════════════════════
//  BUYING POSTS  (/api/posts)
// ═══════════════════════════════════════════════════════════════

// ─── Create Buying Post ───────────────────────────────────────
// POST /api/posts  (multipart/form-data — up to 3 photos)
export const createBuyingPost = (fields, photos = []) => {
  const formData = new FormData();
  Object.entries(fields).forEach(([key, val]) => {
    if (val !== undefined && val !== null) formData.append(key, val);
  });
  photos.forEach((photo) => formData.append('photos', photo));
  return api.post('/posts', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// ─── Get All Approved Buying Posts ────────────────────────────
// GET /api/posts
export const getBuyingPosts = () => api.get('/posts');

// ─── Get My Buying Posts ──────────────────────────────────────
// GET /api/posts/my-posts
export const getMyBuyingPosts = () => api.get('/posts/my-posts');

// ─── Update Buying Post ───────────────────────────────────────
// PUT /api/posts/:id  (multipart/form-data — up to 3 photos)
export const updateBuyingPost = (id, fields, photos = []) => {
  const formData = new FormData();
  Object.entries(fields).forEach(([key, val]) => {
    if (val !== undefined && val !== null) formData.append(key, val);
  });
  photos.forEach((photo) => formData.append('photos', photo));
  return api.put(`/posts/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// ─── Delete Buying Post ───────────────────────────────────────
// DELETE /api/posts/:id
export const deleteBuyingPost = (id) => api.delete(`/posts/${id}`);

// ─── Update Post Status (Admin) ───────────────────────────────
// PUT /api/posts/:id/status  { status: 'approved' | 'rejected' }
export const updateBuyingPostStatus = (id, status) =>
  api.put(`/posts/${id}/status`, { status });

// ═══════════════════════════════════════════════════════════════
//  KNOWLEDGE  (/api/knowledge)
// ═══════════════════════════════════════════════════════════════

// ─── Get All Articles ─────────────────────────────────────────
// GET /api/knowledge
export const getKnowledgeArticles = () => api.get('/knowledge');

// ─── Create Article (Admin) ───────────────────────────────────
// POST /api/knowledge  { title, content, youtubeLink? }
export const createKnowledgeArticle = (data) => api.post('/knowledge', data);
