// src/api/cancelOrderApi.js
import api from "./axiosConfig";

// Cancel an order by orderId
export const cancelOrder = (orderId) => {
  return api.put(`/orders/cancel/${orderId}`);
};
