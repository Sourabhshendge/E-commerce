// ---------------- ADMIN APIs ----------------

import api from "./axiosConfig";

// CREATE CATEGORY
export const createCategory = (categoryData, token) => {
  return api.post("/admin/categories", categoryData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// UPDATE CATEGORY
export const updateCategory = (categoryId, categoryData, token) => {
  return api.put(`/admin/categories/${categoryId}`, categoryData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// DELETE CATEGORY
export const deleteCategory = (categoryId, token) => {
  return api.delete(`/admin/categories/${categoryId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// ---------------- ADMIN GET ----------------

// GET CATEGORY BY ID
export const getCategoryById = (categoryId, token) => {
  return api.get(`/admin/categories/${categoryId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// GET ALL CATEGORIES
export const getAllCategories = (token) => {
  return api.get("/admin/categories", {
    headers: { Authorization: `Bearer ${token}` },
  });
};
