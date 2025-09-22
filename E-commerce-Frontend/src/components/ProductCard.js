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
  Snackbar,
  Alert as MuiAlert
} from "@mui/material";

import React, { useMemo, useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { likeProduct, dislikeProduct, getLikedProducts } from "../api/likeApi";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useCart } from "../context/CartContext";

const ProductCard = React.memo(function ProductCard({ product, onView, showLike = true, onRemove }) {
  const { addToCart, loading: cartLoading } = useCart();
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const userId = user?.userId;
  const [toast, setToast] = useState({ open: false, message: '', type: 'success' });

  useEffect(() => {
    if (!showLike) return;
    let mounted = true;
    async function fetchLiked() {
      if (!userId || !product?.id) return;
      try {
        const res = await getLikedProducts(userId);
        const likedArr = res.data || [];
        if (mounted) setLiked(likedArr.some(p => p.productId === (product.id || product.productId)));
      } catch {
        if (mounted) setLiked(false);
      }
    }
    fetchLiked();
    return () => { mounted = false; };
  }, [userId, product?.id, showLike]);

  const handleLikeToggle = async () => {
    if (!userId || !product?.id) return;
    try {
      if (liked) {
        await dislikeProduct(userId, product.id || product.productId);
        setLiked(false);
        setToast({ open: true, message: 'Product removed from likes', type: 'info' });
      } else {
        await likeProduct(userId, product.id || product.productId);
        setLiked(true);
        setToast({ open: true, message: 'Product added to likes', type: 'success' });
      }
    } catch {
      setToast({ open: true, message: 'Action failed', type: 'error' });
    }
  };

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
    <>
      <Card
        className="modern-card"
        sx={{
          width: 260,
          height: 400,
          display: "flex",
          flexDirection: "column",
          bgcolor: "#fff",
          borderRadius: 2,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          '&:hover': {
            transform: "translateY(-8px)",
            boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
          },
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
              bgcolor: "linear-gradient(135deg, #e0f7fa 0%, #ffffff 100%)",
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              overflow: "hidden",
            }}
          >
            <CardMedia
              component="img"
              sx={{
                height: 140,
                width: 140,
                objectFit: "contain",
                transition: "transform 0.3s ease",
                '&:hover': {
                  transform: "scale(1.05)",
                },
              }}
              image={imageUrl}
              alt={product.name}
            />
          </Box>
        )}
        <CardContent sx={{ flexGrow: 1, p: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="h6" fontWeight="bold" noWrap sx={{ maxWidth: '70%' }}>
              {product.name}
            </Typography>
            <Chip
              label={typeof product.price === 'number' ? `$${product.price.toFixed(2)}` : '$0.00'}
              color="primary"
              size="small"
              sx={{ fontWeight: 700 }}
            />
            {showLike ? (
              <Box sx={{ ml: 1 }}>
                <span style={{ cursor: 'pointer' }} onClick={handleLikeToggle} title={liked ? "Dislike" : "Like"}>
                  {liked ? (
                    <FavoriteIcon sx={{ color: '#e53935' }} />
                  ) : (
                    <FavoriteBorderIcon sx={{ color: '#888' }} />
                  )}
                </span>
              </Box>
            ) : (
              onRemove && (
                <Box sx={{ ml: 1 }}>
                  <Button color="error" size="small" variant="outlined" onClick={() => onRemove(product.id || product.productId)}>
                    Remove
                  </Button>
                </Box>
              )
            )}
          </Stack>
          {product.categoryName && (
            <Chip
              label={product.categoryName}
              size="small"
              sx={{ mb: 1, bgcolor: "#f0f0f0", color: "text.secondary" }}
            />
          )}
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1, minHeight: 36 }}>
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
            onClick={() => {
              try {
                onView?.(product.id);
              } catch (err) {
                setToast({ open: true, message: 'Failed to view product details', type: 'error' });
              }
            }}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              transition: "background-color 0.3s ease, transform 0.2s ease",
              '&:hover': {
                backgroundColor: "#1565c0",
                transform: "scale(1.03)",
              },
            }}
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
            onClick={async () => {
              try {
                await addToCart(product.id || product.productId, 1);
                setToast({ open: true, message: 'Product added to cart', type: 'success' });
              } catch (err) {
                setToast({ open: true, message: 'Failed to add to cart', type: 'error' });
              }
            }}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              borderColor: "#1976d2",
              color: "#1976d2",
              transition: "border-color 0.3s ease, color 0.3s ease, transform 0.2s ease",
              '&:hover': {
                borderColor: "#115293",
                color: "#115293",
                transform: "scale(1.03)",
              },
            }}
          >
            {product.stock < 1 ? "Out of Stock" : cartLoading ? "Adding..." : "Add to Cart"}
          </Button>
        </CardActions>
      </Card>
      <Snackbar open={toast.open} autoHideDuration={2500} onClose={() => setToast({ ...toast, open: false })} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <MuiAlert elevation={6} variant="filled" severity={toast.type} sx={{ width: '100%' }}>
          {toast.message}
        </MuiAlert>
      </Snackbar>
    </>
  );
});

export default ProductCard;
