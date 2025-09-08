import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  Stack,
} from "@mui/material";


import React, { useMemo } from "react";
import { useCart } from "../context/CartContext";


const ProductCard = React.memo(function ProductCard({ product, onView }) {
  const { addToCart, loading: cartLoading } = useCart();
  // Memoize buildImageUrl
  const buildImageUrl = useMemo(() => (url) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    if (url.startsWith("/images/")) return `http://localhost:8081${url}`;
    return `http://localhost:8081/images/${url.startsWith("/") ? url.slice(1) : url}`;
  }, []);

  const imageUrl = useMemo(() =>
    product.imageUrls?.[0] ? buildImageUrl(product.imageUrls[0]) : null,
    [product.imageUrls, buildImageUrl]
  );

  return (
    <Card
      className="minimal-card"
      sx={{
        width: 260,
        minWidth: 260,
        maxWidth: 260,
        height: 390,
        minHeight: 390,
        maxHeight: 390,
        display: "flex",
        flexDirection: "column",
        bgcolor: "#fff",
      }}
    >
      {imageUrl && (
        <Box
          sx={{
            height: 160,
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "#f8f8f8",
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            overflow: "hidden"
          }}
        >
          <CardMedia
            component="img"
            sx={{ height: 140, width: 140, objectFit: "contain", display: "block" }}
            image={imageUrl}
            alt={product.name}
          />
        </Box>
      )}

      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 1 }}
        >
          <Typography variant="h6" fontWeight="bold" noWrap>
            {product.name}
          </Typography>
          <Chip
            label={`$${product.price.toFixed(2)}`}
            color="primary"
            size="small"
            sx={{ fontWeight: 700 }}
          />
        </Stack>
        {product.categoryName && (
          <Chip
            label={product.categoryName}
            size="small"
            sx={{ mb: 1, bgcolor: "#f0f0f0", color: "text.secondary" }}
          />
        )}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 1, minHeight: 36 }}
        >
          {product.description}
        </Typography>
        <Typography
          variant="body2"
          color={product.stock > 0 ? "success.main" : "error"}
          fontWeight={500}
        >
          {product.stock > 0 ? `In Stock: ${product.stock}` : "Out of Stock"}
        </Typography>
      </CardContent>
      <CardActions sx={{ p: 2, pt: 0, flexDirection: 'column', gap: 1 }}>
        <Button
          size="medium"
          variant="contained"
          color="primary"
          fullWidth
          className="minimal-btn"
          onClick={() => onView?.(product.id)}
        >
          View Details
        </Button>
        <Button
          size="medium"
          variant="outlined"
          color="secondary"
          fullWidth
          className="minimal-btn"
          disabled={cartLoading || product.stock < 1}
          onClick={() => addToCart(product.id || product.productId, 1)}
        >
          {product.stock < 1 ? "Out of Stock" : cartLoading ? "Adding..." : "Add to Cart"}
        </Button>
      </CardActions>
    </Card>
  );
});

export default ProductCard;
