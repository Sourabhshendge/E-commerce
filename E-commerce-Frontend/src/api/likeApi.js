import api from "./axiosConfig";

// Like a product
export const likeProduct = (userId, productId, token) => {
  return api.post("/likes/like", null, {
    params: { userId, productId },
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};

// Dislike (unlike) a product
export const dislikeProduct = (userId, productId, token) => {
  return api.delete("/likes/dislike", {
    params: { userId, productId },
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};

// Get all liked products for a user
export const getLikedProducts = (userId, token) => {
  return api.get("/likes/list", {
    params: { userId },
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};
