import { useCallback } from 'react';
import api from '../utils/api';

/**
 * Custom hook to prefetch data based on user intent (e.g., hovering links or cards).
 * Uses sessionStorage as an in-memory cache to avoid duplicate network calls.
 */
export const usePrefetch = () => {
    const prefetchListings = useCallback((params = { page: 1, limit: 12 }) => {
        const cacheKey = `prefetch_listings_${JSON.stringify(params)}`;
        if (sessionStorage.getItem(cacheKey)) return;

        api.get('/listings', { params })
            .then(() => sessionStorage.setItem(cacheKey, '1'))
            .catch(() => {});
    }, []);

    const prefetchPosts = useCallback((params = { page: 1, limit: 12 }) => {
        const cacheKey = `prefetch_posts_${JSON.stringify(params)}`;
        if (sessionStorage.getItem(cacheKey)) return;

        api.get('/posts', { params })
            .then(() => sessionStorage.setItem(cacheKey, '1'))
            .catch(() => {});
    }, []);

    const prefetchProductDetails = useCallback((id, type = 'selling') => {
        const cacheKey = `prefetch_product_${type}_${id}`;
        if (sessionStorage.getItem(cacheKey)) return;

        const endpoint = type === 'selling' ? `/listings/${id}` : `/posts/${id}`;
        api.get(endpoint)
            .then(() => sessionStorage.setItem(cacheKey, '1'))
            .catch(() => {});
    }, []);

    return {
        prefetchListings,
        prefetchPosts,
        prefetchProductDetails
    };
};

export default usePrefetch;
