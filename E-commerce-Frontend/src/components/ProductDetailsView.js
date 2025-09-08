import { Box, Typography, Chip, Button, Stack, Paper } from "@mui/material";
import { useCart } from "../context/CartContext";
import React, { useState, useMemo } from "react";


const ProductDetailsView = React.memo(function ProductDetailsView({ product }) {
  const { addToCart, loading: cartLoading } = useCart();
  const [imgIndex, setImgIndex] = useState(0);
  const images = product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls : [];

  // Memoize buildImageUrl
  const buildImageUrl = useMemo(() => (url) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    if (url.startsWith("/images/")) return `http://localhost:8081${url}`;
    return `http://localhost:8081/images/${url.startsWith("/") ? url.slice(1) : url}`;
  }, []);

  const handlePrev = () => setImgIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const handleNext = () => setImgIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <Paper elevation={4} sx={{ maxWidth: 600, mx: "auto", mt: 5, p: 4, borderRadius: 4, bgcolor: "#fafbfc" }}>
      <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4 }}>
        {/* Image Carousel */}
        <Box sx={{ flex: 1, minWidth: 320, maxWidth: 350, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Box sx={{ position: "relative", width: 320, height: 320, mb: 2 }}>
            {images.length > 0 ? (
              <img
                src={buildImageUrl(images[imgIndex])}
                alt={product.name}
                style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: 12, boxShadow: "0 2px 12px #0001" }}
              />
            ) : (
              <Box sx={{ width: 320, height: 320, bgcolor: "#f0f0f0", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Typography color="text.secondary">No Image</Typography>
              </Box>
            )}
            {images.length > 1 && (
              <>
                <Button onClick={handlePrev} size="small" sx={{ position: "absolute", left: 8, top: "45%", minWidth: 0, px: 1, bgcolor: "#fff8", borderRadius: "50%" }}>&lt;</Button>
                <Button onClick={handleNext} size="small" sx={{ position: "absolute", right: 8, top: "45%", minWidth: 0, px: 1, bgcolor: "#fff8", borderRadius: "50%" }}>&gt;</Button>
              </>
            )}
          </Box>
          {images.length > 1 && (
            <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 1 }}>
              {images.map((img, idx) => (
                <Box
                  key={idx}
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    bgcolor: idx === imgIndex ? "primary.main" : "grey.300",
                    border: idx === imgIndex ? "2px solid #1976d2" : "1px solid #ccc",
                    cursor: "pointer"
                  }}
                  onClick={() => setImgIndex(idx)}
                />
              ))}
            </Stack>
          )}
        </Box>
        {/* Product Info */}
        <Box sx={{ flex: 2, minWidth: 260 }}>
          <Typography variant="h4" fontWeight={700} mb={2}>{product.name}</Typography>
          <Chip label={`$${product.price.toFixed(2)}`} color="primary" sx={{ fontSize: 18, fontWeight: 700, mb: 2 }} />
          <Typography variant="body1" color="text.secondary" mb={2}>{product.description}</Typography>
          <Typography variant="body2" color={product.stock > 0 ? "success.main" : "error"} fontWeight={500} mb={2}>
            {product.stock > 0 ? `In Stock: ${product.stock}` : "Out of Stock"}
          </Typography>
          {product.categoryName && (
            <Chip label={product.categoryName} size="medium" sx={{ mb: 2, bgcolor: "#f0f0f0", color: "text.secondary" }} />
          )}
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 3, px: 4, fontWeight: 600, fontSize: 18 }}
            disabled={cartLoading || product.stock < 1}
            onClick={() => addToCart(product.id || product.productId, 1)}
          >
            {product.stock < 1 ? "Out of Stock" : cartLoading ? "Adding..." : "Add to Cart"}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
});

export default ProductDetailsView;
