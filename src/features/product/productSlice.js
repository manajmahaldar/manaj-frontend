/**
 * features/product/productSlice.js
 * Redux slice for listings, buying posts, and knowledge articles.
 *
 * State shape:
 * {
 *   listings:       Listing[],
 *   myListings:     Listing[],
 *   posts:          BuyingPost[],
 *   myPosts:        BuyingPost[],
 *   articles:       KnowledgeArticle[],
 *   loading:        boolean,
 *   error:          string | null,
 * }
 */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as productApi from './api/product.api.js';

// ─── Async Thunks — Listings ──────────────────────────────────────────────────

export const fetchListings = createAsyncThunk(
  'product/fetchListings',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await productApi.getListings();
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || 'Failed to load listings');
    }
  }
);

export const fetchMyListings = createAsyncThunk(
  'product/fetchMyListings',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await productApi.getMyListings();
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || 'Failed to load your listings');
    }
  }
);

export const addListing = createAsyncThunk(
  'product/addListing',
  async ({ fields, photos }, { rejectWithValue }) => {
    try {
      const { data } = await productApi.createListing(fields, photos);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || 'Failed to create listing');
    }
  }
);

export const editListing = createAsyncThunk(
  'product/editListing',
  async ({ id, fields, photos }, { rejectWithValue }) => {
    try {
      const { data } = await productApi.updateListing(id, fields, photos);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || 'Failed to update listing');
    }
  }
);

export const removeListing = createAsyncThunk(
  'product/removeListing',
  async (id, { rejectWithValue }) => {
    try {
      await productApi.deleteListing(id);
      return id; // return id for optimistic removal
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || 'Failed to delete listing');
    }
  }
);

// ─── Async Thunks — Buying Posts ──────────────────────────────────────────────

export const fetchBuyingPosts = createAsyncThunk(
  'product/fetchBuyingPosts',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await productApi.getBuyingPosts();
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || 'Failed to load buying posts');
    }
  }
);

export const fetchMyBuyingPosts = createAsyncThunk(
  'product/fetchMyBuyingPosts',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await productApi.getMyBuyingPosts();
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || 'Failed to load your posts');
    }
  }
);

export const addBuyingPost = createAsyncThunk(
  'product/addBuyingPost',
  async ({ fields, photos }, { rejectWithValue }) => {
    try {
      const { data } = await productApi.createBuyingPost(fields, photos);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || 'Failed to create post');
    }
  }
);

export const editBuyingPost = createAsyncThunk(
  'product/editBuyingPost',
  async ({ id, fields, photos }, { rejectWithValue }) => {
    try {
      const { data } = await productApi.updateBuyingPost(id, fields, photos);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || 'Failed to update post');
    }
  }
);

export const removeBuyingPost = createAsyncThunk(
  'product/removeBuyingPost',
  async (id, { rejectWithValue }) => {
    try {
      await productApi.deleteBuyingPost(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || 'Failed to delete post');
    }
  }
);

// ─── Async Thunks — Knowledge ─────────────────────────────────────────────────

export const fetchKnowledgeArticles = createAsyncThunk(
  'product/fetchKnowledgeArticles',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await productApi.getKnowledgeArticles();
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || 'Failed to load articles');
    }
  }
);

export const addKnowledgeArticle = createAsyncThunk(
  'product/addKnowledgeArticle',
  async (articleData, { rejectWithValue }) => {
    try {
      const { data } = await productApi.createKnowledgeArticle(articleData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || 'Failed to create article');
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────
const productSlice = createSlice({
  name: 'product',
  initialState: {
    listings:   [],
    myListings: [],
    posts:      [],
    myPosts:    [],
    articles:   [],
    loading:    false,
    error:      null,
  },

  reducers: {
    clearProductError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    const pending  = (state)           => { state.loading = true;  state.error = null; };
    const rejected = (state, { payload }) => { state.loading = false; state.error = payload; };

    // ── Listings ───────────────────────────────────────────────────────────
    builder
      .addCase(fetchListings.pending,   pending)
      .addCase(fetchListings.fulfilled, (state, { payload }) => {
        state.loading  = false;
        state.listings = payload;
      })
      .addCase(fetchListings.rejected,  rejected);

    builder
      .addCase(fetchMyListings.pending,   pending)
      .addCase(fetchMyListings.fulfilled, (state, { payload }) => {
        state.loading    = false;
        state.myListings = payload;
      })
      .addCase(fetchMyListings.rejected,  rejected);

    builder
      .addCase(addListing.pending,   pending)
      .addCase(addListing.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.myListings.unshift(payload);
      })
      .addCase(addListing.rejected,  rejected);

    builder
      .addCase(editListing.pending,   pending)
      .addCase(editListing.fulfilled, (state, { payload }) => {
        state.loading    = false;
        state.myListings = state.myListings.map((l) =>
          l._id === payload._id ? payload : l
        );
        state.listings = state.listings.map((l) =>
          l._id === payload._id ? payload : l
        );
      })
      .addCase(editListing.rejected,  rejected);

    builder
      .addCase(removeListing.pending,   pending)
      .addCase(removeListing.fulfilled, (state, { payload: id }) => {
        state.loading    = false;
        state.myListings = state.myListings.filter((l) => l._id !== id);
        state.listings   = state.listings.filter((l) => l._id !== id);
      })
      .addCase(removeListing.rejected,  rejected);

    // ── Buying Posts ───────────────────────────────────────────────────────
    builder
      .addCase(fetchBuyingPosts.pending,   pending)
      .addCase(fetchBuyingPosts.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.posts   = payload;
      })
      .addCase(fetchBuyingPosts.rejected,  rejected);

    builder
      .addCase(fetchMyBuyingPosts.pending,   pending)
      .addCase(fetchMyBuyingPosts.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.myPosts = payload;
      })
      .addCase(fetchMyBuyingPosts.rejected,  rejected);

    builder
      .addCase(addBuyingPost.pending,   pending)
      .addCase(addBuyingPost.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.myPosts.unshift(payload);
      })
      .addCase(addBuyingPost.rejected,  rejected);

    builder
      .addCase(editBuyingPost.pending,   pending)
      .addCase(editBuyingPost.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.myPosts = state.myPosts.map((p) => (p._id === payload._id ? payload : p));
        state.posts   = state.posts.map((p)   => (p._id === payload._id ? payload : p));
      })
      .addCase(editBuyingPost.rejected,  rejected);

    builder
      .addCase(removeBuyingPost.pending,   pending)
      .addCase(removeBuyingPost.fulfilled, (state, { payload: id }) => {
        state.loading = false;
        state.myPosts = state.myPosts.filter((p) => p._id !== id);
        state.posts   = state.posts.filter((p)   => p._id !== id);
      })
      .addCase(removeBuyingPost.rejected,  rejected);

    // ── Knowledge ──────────────────────────────────────────────────────────
    builder
      .addCase(fetchKnowledgeArticles.pending,   pending)
      .addCase(fetchKnowledgeArticles.fulfilled, (state, { payload }) => {
        state.loading  = false;
        state.articles = payload;
      })
      .addCase(fetchKnowledgeArticles.rejected,  rejected);

    builder
      .addCase(addKnowledgeArticle.pending,   pending)
      .addCase(addKnowledgeArticle.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.articles.unshift(payload);
      })
      .addCase(addKnowledgeArticle.rejected,  rejected);
  },
});

export const { clearProductError } = productSlice.actions;

// ─── Selectors ────────────────────────────────────────────────────────────────
export const selectListings       = (state) => state.product.listings;
export const selectMyListings     = (state) => state.product.myListings;
export const selectBuyingPosts    = (state) => state.product.posts;
export const selectMyBuyingPosts  = (state) => state.product.myPosts;
export const selectArticles       = (state) => state.product.articles;
export const selectProductLoading = (state) => state.product.loading;
export const selectProductError   = (state) => state.product.error;

export default productSlice.reducer;
