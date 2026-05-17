/**
 * product.service.js
 * Business-logic wrapper around product.api.js (listings, buying posts, knowledge).
 */
import * as productApi from '../api/product.api.js';

// ═══════════════════════════════════════════════════════════════
//  LISTINGS
// ═══════════════════════════════════════════════════════════════

// ─── Get All Approved Listings ────────────────────────────────
// Returns listing[]
export const getListings = async () => {
  const { data } = await productApi.getListings();
  return data;
};

// ─── Get My Listings ──────────────────────────────────────────
// Returns listing[]
export const getMyListings = async () => {
  const { data } = await productApi.getMyListings();
  return data;
};

// ─── Create Listing ───────────────────────────────────────────
// @param {Object} fields  — listing fields (title, species, price, qty, etc.)
// @param {File[]} photos  — up to 3 image files
// Returns created listing object
export const createListing = async (fields, photos = []) => {
  const { data } = await productApi.createListing(fields, photos);
  return data;
};

// ─── Update Listing ───────────────────────────────────────────
// @param {string} id
// @param {Object} fields
// @param {File[]} photos
export const updateListing = async (id, fields, photos = []) => {
  const { data } = await productApi.updateListing(id, fields, photos);
  return data;
};

// ─── Delete Listing ───────────────────────────────────────────
// @param {string} id
export const deleteListing = async (id) => {
  const { data } = await productApi.deleteListing(id);
  return data;
};

// ─── Update Listing Status (Admin) ───────────────────────────
// @param {string} id
// @param {'approved'|'rejected'} status
export const updateListingStatus = async (id, status) => {
  const { data } = await productApi.updateListingStatus(id, status);
  return data;
};

// ═══════════════════════════════════════════════════════════════
//  BUYING POSTS
// ═══════════════════════════════════════════════════════════════

export const getBuyingPosts = async () => {
  const { data } = await productApi.getBuyingPosts();
  return data;
};

export const getMyBuyingPosts = async () => {
  const { data } = await productApi.getMyBuyingPosts();
  return data;
};

export const createBuyingPost = async (fields, photos = []) => {
  const { data } = await productApi.createBuyingPost(fields, photos);
  return data;
};

export const updateBuyingPost = async (id, fields, photos = []) => {
  const { data } = await productApi.updateBuyingPost(id, fields, photos);
  return data;
};

export const deleteBuyingPost = async (id) => {
  const { data } = await productApi.deleteBuyingPost(id);
  return data;
};

// ═══════════════════════════════════════════════════════════════
//  KNOWLEDGE ARTICLES
// ═══════════════════════════════════════════════════════════════

export const getKnowledgeArticles = async () => {
  const { data } = await productApi.getKnowledgeArticles();
  return data;
};

export const createKnowledgeArticle = async ({ title, content, youtubeLink }) => {
  const { data } = await productApi.createKnowledgeArticle({ title, content, youtubeLink });
  return data;
};
