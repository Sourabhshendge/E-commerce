import { useState, useEffect, useCallback } from "react";
import { Box, Button, TextField, Typography, Paper, Snackbar, Alert, MenuItem, CircularProgress } from "@mui/material";
import { useRef } from "react";
import { createProduct } from "../api/productApi";
import { getAllCategories } from "../api/categoryApi";

const initialProduct = {
  name: "",
  description: "",
  price: "",
  stock: "",
  categoryId: "",
  imageUrls: []
};

export default function AddProductPage() {
  const [product, setProduct] = useState(initialProduct);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", type: "success" });
  const [imageFiles, setImageFiles] = useState([]);

  const [categories, setCategories] = useState([]);
  const [catLoading, setCatLoading] = useState(false);
  const [catError, setCatError] = useState("");
  const fileInputRef = useRef();

  useEffect(() => {
    const fetchCategories = async () => {
      setCatLoading(true);
      setCatError("");
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Not authenticated");
        const res = await getAllCategories(token);
        setCategories(res.data.data || []);
      } catch (err) {
        setCatError("Failed to load categories");
        setCategories([]);
      } finally {
        setCatLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = useCallback((e) => {
    setProduct((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  // Handle file input change
  const handleFileChange = (e) => {
    setImageFiles(Array.from(e.target.files));
  };

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");

      // Send product and files together
      const payload = {
        ...product,
        price: parseFloat(product.price),
        stock: parseInt(product.stock, 10),
      };
      await createProduct(payload, imageFiles, token);
      setSnackbar({ open: true, message: "Product added successfully!", type: "success" });
      setProduct(initialProduct);
      setImageFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setSnackbar({ open: true, message: err.message || "Failed to add product", type: "error" });
    } finally {
      setLoading(false);
    }
  }, [product, imageFiles]);

  return (
    <Box sx={{ maxWidth: 480, mx: "auto", mt: 6 }}>
      <Paper elevation={2} sx={{ p: 4, borderRadius: 3, boxShadow: 3, bgcolor: '#fff' }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 2, color: 'primary.main' }}>
          Add New Product
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField label="Name" name="name" value={product.name} onChange={handleChange} required variant="outlined" size="small" />
          <TextField label="Description" name="description" value={product.description} onChange={handleChange} multiline minRows={2} variant="outlined" size="small" />
          <TextField label="Price" name="price" value={product.price} onChange={handleChange} type="number" required inputProps={{ min: 0, step: 0.01 }} variant="outlined" size="small" />
          <TextField label="Stock" name="stock" value={product.stock} onChange={handleChange} type="number" required inputProps={{ min: 0, step: 1 }} variant="outlined" size="small" />
          <TextField select label="Category" name="categoryId" value={product.categoryId} onChange={handleChange} required variant="outlined" size="small">
            {catLoading ? (
              <MenuItem value="" disabled>Loading...</MenuItem>
            ) : catError ? (
              <MenuItem value="" disabled>{catError}</MenuItem>
            ) : categories.length === 0 ? (
              <MenuItem value="" disabled>No categories found</MenuItem>
            ) : (
              categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
              ))
            )}
          </TextField>


          {/* Image file input */}
          <Button
            variant="outlined"
            component="label"
            color="primary"
            sx={{ mb: 1, borderRadius: 2 }}
          >
            Upload Image(s)
            <input
              type="file"
              accept="image/*"
              multiple
              hidden
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </Button>
          {imageFiles.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
              {imageFiles.map((file, idx) => (
                <Typography key={idx} variant="body2">{file.name}</Typography>
              ))}
            </Box>
          )}

          <Button type="submit" variant="contained" color="primary" disabled={loading} sx={{ mt: 2, borderRadius: 2, fontWeight: 600, py: 1.2 }}>
            {loading ? "Adding..." : "Add Product"}
          </Button>
        </Box>
      </Paper>
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.type} sx={{ width: "100%" }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
