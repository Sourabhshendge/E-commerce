// src/api/productApi.js
import api from "./axiosConfig";

// ---------------- ADMIN APIs ----------------

// CREATE PRODUCT
export const createProduct = (productData, files, token) => {
  const formData = new FormData();
  // Send product as JSON blob
  formData.append(
    "product",
    new Blob([JSON.stringify(productData)], { type: "application/json" })
  );
  if (files && files.length) {
    for (const file of files) {
      formData.append("files", file);
    }
  }
  return api.post("/admin/products", formData, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// UPDATE PRODUCT
export const updateProduct = (productId, productData, token) => {
  return api.put(`/admin/products/${productId}`, productData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// DELETE PRODUCT
export const deleteProduct = (productId, token) => {
  return api.delete(`/admin/products/${productId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// ---------------- CUSTOMER APIs ----------------

// GET PRODUCT BY ID
export const getProductById = (productId, token) => {
  return api.get(`/admin/products/${productId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};

// GET ALL PRODUCTS (with pagination & sorting)
export const getAllProducts = (page = 0, size = 10, sort = "id,asc", token) => {
  return api.get(`/admin/products/page`, {
    params: { page, size, sort },
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};

// SEARCH PRODUCTS
export const searchProducts = (keyword, token) => {
  return api.get(`/admin/products/search`, {
    params: { keyword },
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};

// FILTER BY CATEGORY
export const filterProductsByCategory = (categoryId, token) => {
  return api.get(`/admin/products/filter/category/${categoryId}`,
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }
  );
};

// FILTER BY PRICE RANGE
export const filterProductsByPrice = (min, max, token) => {
  return api.get(`/admin/products/filter/price`, {
    params: { min, max },
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};
