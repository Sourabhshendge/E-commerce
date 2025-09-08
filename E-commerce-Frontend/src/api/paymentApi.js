import api from "./axiosConfig";

// Create Razorpay order

export const createPaymentOrder = (userId, amount, token) =>
  api.post("/payment/create-order", { userId, amount }, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

// Verify payment
export const verifyPayment = (data, token) =>
  api.post("/payment/verify", data, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
