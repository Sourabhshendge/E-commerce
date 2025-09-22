import React, { useEffect, useState } from "react";
import { getLikedProducts, dislikeProduct } from "../api/likeApi";
import { useAuth } from "../context/AuthContext";
import LikedProductCard from "../components/LikedProductCard";
import { Box, Typography, CircularProgress, Button } from "@mui/material";

export default function LikedProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.userId) return;
    const fetchLiked = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getLikedProducts(user.userId);
        setProducts(res.data || []);
      } catch (err) {
        setError("Failed to fetch liked products");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLiked();
  }, [user?.userId]);

  const handleDislike = async (productId) => {
    try {
      await dislikeProduct(user.userId, productId);
      setProducts((prev) => prev.filter((p) => p.productId !== productId));
    } catch {
      // Optionally show error
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", px: 2, py: 4 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>Liked Products</Typography>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : products.length === 0 ? (
        <Typography>No liked products found.</Typography>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 3 }}>
          {products.map((product) => (
            <LikedProductCard
              key={product.productId || product.id}
              product={product}
              onRemove={handleDislike}
              onView={(id) => {}}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
