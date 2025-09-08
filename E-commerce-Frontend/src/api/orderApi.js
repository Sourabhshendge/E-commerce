// src/api/orderApi.js
import api from "./axiosConfig";

// Place an order (checkout)
export const placeOrder = (userId) => {
  return api.post(`/orders/checkout/${userId}`);
};

// Get a single order by orderId
export const getOrder = (orderId) => {
  return api.get(`/orders/${orderId}`);
};

// Get all orders for a user
export const getUserOrders = (userId) => {
  return api.get(`/orders/user/${userId}`);
};
