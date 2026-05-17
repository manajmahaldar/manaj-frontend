/**
 * order.api.js
 * All endpoints under /api/orders
 */
import api from './axios.js';

// ─── Create Order ─────────────────────────────────────────────────────────────
// POST /api/orders  { listingId, quantity, ... }
export const createOrder = (data) => api.post('/orders', data);

// ─── Get My Orders (Buyer view) ───────────────────────────────────────────────
// GET /api/orders/my-orders
export const getMyOrders = () => api.get('/orders/my-orders');

// ─── Get Incoming Orders (Seller view) ───────────────────────────────────────
// GET /api/orders/incoming
export const getIncomingOrders = () => api.get('/orders/incoming');

// ─── Get Single Order Details ─────────────────────────────────────────────────
// GET /api/orders/:id
export const getOrderDetails = (id) => api.get(`/orders/${id}`);

// ─── Update Order Status (Verified Seller) ────────────────────────────────────
// PATCH /api/orders/:id/status  { status: 'confirmed' | 'shipped' | 'delivered' | 'cancelled' }
export const updateOrderStatus = (id, status) =>
  api.patch(`/orders/${id}/status`, { status });
