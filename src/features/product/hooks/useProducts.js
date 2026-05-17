/**
 * useProducts.js
 * Data-fetching hook for listings and buying posts.
 *
 * Usage:
 *   // All approved listings
 *   const { listings, loading, error, refetch } = useProducts();
 *
 *   // User's own listings
 *   const { listings, loading, error, refetch } = useProducts({ mine: true });
 *
 *   // Buying posts
 *   const { posts, loading, error, refetch } = useProducts({ type: 'posts' });
 *
 *   // User's own buying posts
 *   const { posts, loading, error, refetch } = useProducts({ type: 'posts', mine: true });
 */
import { useState, useEffect, useCallback } from 'react';
import * as productService from '../../../services/product.service.js';

const useProducts = ({ type = 'listings', mine = false } = {}) => {
  const [listings, setListings]   = useState([]);
  const [posts,    setPosts]      = useState([]);
  const [loading,  setLoading]    = useState(true);
  const [error,    setError]      = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (type === 'listings') {
        const data = mine
          ? await productService.getMyListings()
          : await productService.getListings();
        setListings(data);
      } else if (type === 'posts') {
        const data = mine
          ? await productService.getMyBuyingPosts()
          : await productService.getBuyingPosts();
        setPosts(data);
      }
    } catch (err) {
      setError(err?.response?.data?.msg || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [type, mine]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ─── Mutation helpers ─────────────────────────────────────────────────────
  const createListing = async (fields, photos) => {
    const created = await productService.createListing(fields, photos);
    setListings((prev) => [created, ...prev]);
    return created;
  };

  const updateListing = async (id, fields, photos) => {
    const updated = await productService.updateListing(id, fields, photos);
    setListings((prev) => prev.map((l) => (l._id === id ? updated : l)));
    return updated;
  };

  const deleteListing = async (id) => {
    await productService.deleteListing(id);
    setListings((prev) => prev.filter((l) => l._id !== id));
  };

  const createPost = async (fields, photos) => {
    const created = await productService.createBuyingPost(fields, photos);
    setPosts((prev) => [created, ...prev]);
    return created;
  };

  const updatePost = async (id, fields, photos) => {
    const updated = await productService.updateBuyingPost(id, fields, photos);
    setPosts((prev) => prev.map((p) => (p._id === id ? updated : p)));
    return updated;
  };

  const deletePost = async (id) => {
    await productService.deleteBuyingPost(id);
    setPosts((prev) => prev.filter((p) => p._id !== id));
  };

  return {
    // State
    listings,
    posts,
    loading,
    error,
    // Refetch
    refetch: fetchData,
    // Listing mutations
    createListing,
    updateListing,
    deleteListing,
    // Post mutations
    createPost,
    updatePost,
    deletePost,
  };
};

export default useProducts;
