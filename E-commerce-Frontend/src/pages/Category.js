import { useEffect, useState, useCallback } from "react";
import { getAllCategories, createCategory, deleteCategory } from "../api/categoryApi";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Snackbar,
  Alert,
  IconButton,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: "" });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "success",
  });

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found. Please login as ADMIN.");
        return;
      }
      const res = await getAllCategories(token);
      setCategories(res.data.data || []);
    } catch (err) {
      console.error("Error fetching categories", err);
      setSnackbar({
        open: true,
        message: "Unauthorized or failed to fetch categories",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);


  const handleAddCategory = useCallback(async (e) => {
    e.preventDefault();
    if (!newCategory.name.trim()) {
      setSnackbar({
        open: true,
        message: "Category name is required",
        type: "error",
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      await createCategory(newCategory, token);
      setSnackbar({
        open: true,
        message: "Category added successfully!",
        type: "success",
      });
      setNewCategory({ name: "" });
      fetchCategories();
    } catch (err) {
      console.error("Error creating category", err);
      setSnackbar({
        open: true,
        message: "Failed to add category",
        type: "error",
      });
    }
  }, [newCategory, fetchCategories]);

  const handleDeleteCategory = useCallback(async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      await deleteCategory(id, token);
      setSnackbar({
        open: true,
        message: "Category deleted successfully!",
        type: "success",
      });
      fetchCategories();
    } catch (err) {
      console.error("Error deleting category", err);
      setSnackbar({
        open: true,
        message: "Failed to delete category",
        type: "error",
      });
    }
  }, [fetchCategories]);

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "name", headerName: "Name", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.5,
      sortable: false,
      renderCell: (params) => (
        <IconButton
          color="error"
          onClick={() => handleDeleteCategory(params.row.id)}
        >
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <Container sx={{ mt: 4, maxWidth: 700 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: 'primary.main', mb: 3 }}>
        Category Management
      </Typography>

      {/* Add Category Form */}
      <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 3, boxShadow: 2, bgcolor: '#fff' }}>
        <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
          Add New Category
        </Typography>
        <Box
          component="form"
          onSubmit={handleAddCategory}
          sx={{ display: "flex", gap: 2, alignItems: "center" }}
        >
          <TextField
            label="Category Name"
            variant="outlined"
            size="small"
            value={newCategory.name}
            onChange={(e) => setNewCategory({ name: e.target.value })}
            required
          />
          <Button type="submit" variant="contained" color="primary" sx={{ borderRadius: 2, fontWeight: 600, py: 1 }}>
            Add
          </Button>
        </Box>
      </Paper>

      {/* Category Table */}
      <Paper elevation={1} sx={{ height: 400, width: "100%", borderRadius: 3, boxShadow: 1, bgcolor: '#fff' }}>
        <DataGrid
          rows={categories.map((cat, index) => ({ id: index, ...cat }))}
          columns={columns}
          pageSize={5}
          loading={loading}
        />
      </Paper>

      {/* Snackbar Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.type} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
