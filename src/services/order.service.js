/**
 * order.service.js
 * Business-logic wrapper around order.api.js.
 */
import * as orderApi from '../api/order.api.js';

// ─── Create Order ─────────────────────────────────────────────────────────────
// @param {{ listingId, quantity, ...}} data
// Returns created order object
export const createOrder = async (data) => {
  const { data: res } = await orderApi.createOrder(data);
  return res;
};

// ─── Get My Orders (Buyer) ────────────────────────────────────────────────────
// Returns order[]
export const getMyOrders = async () => {
  const { data } = await orderApi.getMyOrders();
  return data;
};

// ─── Get Incoming Orders (Seller) ─────────────────────────────────────────────
// Returns order[]
export const getIncomingOrders = async () => {
  const { data } = await orderApi.getIncomingOrders();
  return data;
};

// ─── Get Single Order ─────────────────────────────────────────────────────────
// @param {string} id
// Returns order object
export const getOrderDetails = async (id) => {
  const { data } = await orderApi.getOrderDetails(id);
  return data;
};

// ─── Update Order Status ──────────────────────────────────────────────────────
// @param {string} id
// @param {'confirmed'|'shipped'|'delivered'|'cancelled'} status
export const updateOrderStatus = async (id, status) => {
  const { data } = await orderApi.updateOrderStatus(id, status);
  return data;
};
