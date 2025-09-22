import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { filterProductsByCategory } from "../api/productApi";
import ProductGrid from "../components/ProductGrid";
import { Box, Typography, CircularProgress } from "@mui/material";

export default function CategoryProductsPage() {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await filterProductsByCategory(id, token);
        let prods = res.data;
        if (!Array.isArray(prods)) {
          if (prods && Array.isArray(prods.data)) {
            prods = prods.data;
          } else if (prods && Array.isArray(prods.content)) {
            prods = prods.content;
          } else {
            prods = [];
          }
        }
        setProducts(prods);
      } catch (err) {
        setError("Failed to load products for this category");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [id]);

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", px: 2, py: 4 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Products in Category
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <ProductGrid products={products} loading={false} error={null} />
      )}
    </Box>
  );
}
