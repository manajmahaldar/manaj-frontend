/**
 * features/product/api/product.api.js
 * Re-exports from shared api layer — thunks import only from here.
 */
export {
  // Listings
  getListings,
  getMyListings,
  createListing,
  updateListing,
  deleteListing,
  updateListingStatus,
  // Buying posts
  getBuyingPosts,
  getMyBuyingPosts,
  createBuyingPost,
  updateBuyingPost,
  deleteBuyingPost,
  updateBuyingPostStatus,
  // Knowledge
  getKnowledgeArticles,
  createKnowledgeArticle,
} from '../../../api/product.api.js';
