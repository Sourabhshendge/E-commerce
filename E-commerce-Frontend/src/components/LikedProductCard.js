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
import React, { useMemo, useState } from "react";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const LikedProductCard = React.memo(function LikedProductCard({ product, onRemove, onView }) {
  const [toast, setToast] = useState({ open: false, message: '', type: 'success' });
  const buildImageUrl = useMemo(() => (url) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    if (url.startsWith("/images/")) return `http://localhost:8081${url}`;
    return `http://localhost:8081/images/${url.startsWith("/") ? url.slice(1) : url}`;
  }, []);

  const imageUrl = useMemo(() =>
    product.imageUrls?.[0] ? buildImageUrl(product.imageUrls[0]) : "https://via.placeholder.com/140x140?text=No+Image",
    [product.imageUrls, buildImageUrl]
  );

  return (
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
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
        },
      }}
    >
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
          sx={{ height: 140, width: 140, objectFit: "contain" }}
          image={imageUrl}
          alt={product.name}
        />
      </Box>
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
          <Box sx={{ ml: 1 }}>
            <Button color="error" size="small" variant="outlined" onClick={() => {
              onRemove(product.id || product.productId);
              setToast({ open: true, message: 'Product removed from likes', type: 'info' });
            }}>
              Remove
            </Button>
      <Snackbar open={toast.open} autoHideDuration={2500} onClose={() => setToast({ ...toast, open: false })} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <MuiAlert elevation={6} variant="filled" severity={toast.type} sx={{ width: '100%' }}>
          {toast.message}
        </MuiAlert>
      </Snackbar>
          </Box>
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
          onClick={() => onView?.(product.id)}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            transition: "background-color 0.3s ease, transform 0.2s ease",
            "&:hover": {
              backgroundColor: "#1565c0",
              transform: "scale(1.03)",
            },
          }}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
});

export default LikedProductCard;
