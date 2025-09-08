import api from "./axiosConfig";

// ---------------- ADMIN APIs ----------------

// GET ALL USERS
export const getAllUsers = (token) => {
  return api.get("/admin/users", {
    headers: { Authorization: `Bearer ${token}` },
  });
};


// GET USER BY ID
export const getUserById = (id, token) => {
  return api.get(`/admin/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// UPDATE USER
export const updateUser = (id, userData, token) => {
  return api.put(`/admin/users/${id}`, userData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// DELETE USER
export const deleteUser = (id, token) => {
  return api.delete(`/admin/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
