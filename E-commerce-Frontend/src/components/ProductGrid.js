
import React, { useCallback } from "react";
import ProductCard from "./ProductCard";
import { useNavigate } from "react-router-dom";
import { Box, CircularProgress, Typography, Grid } from "@mui/material";

const ProductGrid = React.memo(function ProductGrid({ products, loading, error }) {
  const navigate = useNavigate();
  const handleView = useCallback((id) => {
    navigate(`/product/${id}`);
  }, [navigate]);
  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box>;
  if (error) return <Typography color="error" sx={{ py: 4, textAlign: 'center' }}>{error}</Typography>;
  if (!products.length) return <Typography sx={{ py: 4, textAlign: 'center', color: 'text.secondary' }}>No products found.</Typography>;
  return (
    <Grid container spacing={3} sx={{ mt: 1 }} className="minimal-grid">
      {products.map((p) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={p.id}>
          <ProductCard
            product={p}
            onView={() => handleView(p.id)}
          />
        </Grid>
      ))}
    </Grid>
  );
});

export default ProductGrid;
