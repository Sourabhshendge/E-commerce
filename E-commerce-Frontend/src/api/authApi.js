import api from "./axiosConfig";

// REGISTER USER
export const registerUser = (userData) => {
  // userData = { name, email, password, ... }
  return api.post("/auth/register", userData);
};

// VERIFY OTP
export const verifyOtp = (otpData) => {
  // otpData = { email, otp }
  return api.post("/auth/verify-otp", otpData);
};

// LOGIN USER
export const loginUser = (credentials) => {
  // credentials = { email, password }
  return api.post("/auth/login", credentials);
};
