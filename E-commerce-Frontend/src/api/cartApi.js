// src/api/cartApi.js
import api from "./axiosConfig";

// Add a product to the cart
export const addToCart = (userId, productId, quantity = 1) => {
  return api.post("/cart/add", {
    userId,
    productId,
    quantity,
  });
};

// Get the cart for a user
export const getCart = (userId) => {
  return api.get(`/cart/${userId}`);
};

// Remove a product from the user's cart
export const removeFromCart = (userId, productId) => {
  return api.delete(`/cart/remove/${userId}/${productId}`);
};
