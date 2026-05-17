/**
 * store/index.js
 * Central Redux store — import this once in main.jsx and wrap <App> with <Provider>.
 */
import { configureStore } from '@reduxjs/toolkit';
import authReducer    from '../features/auth/authSlice.js';
import productReducer from '../features/product/productSlice.js';
import orderReducer   from '../features/order/orderSlice.js';

export const store = configureStore({
  reducer: {
    auth:    authReducer,
    product: productReducer,
    order:   orderReducer,
  },
});

export default store;
