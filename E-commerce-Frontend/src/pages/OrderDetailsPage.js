import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrder } from "../api/orderApi";
import { cancelOrder } from "../api/cancelOrderApi";
import { Box, Typography, Paper, Divider, Stack, Avatar, Button, CircularProgress, Snackbar, Alert } from "@mui/material";

export default function OrderDetailsPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', type: 'success' });

  useEffect(() => {
    setLoading(true);
    getOrder(orderId)
      .then(res => setOrder(res.data.data))
      .catch(() => setSnackbar({ open: true, message: 'Failed to fetch order', type: 'error' }))
      .finally(() => setLoading(false));
  }, [orderId]);

  const handleCancel = async () => {
    setCancelLoading(true);
    try {
      const res = await cancelOrder(orderId);
      setOrder(res.data);
      setSnackbar({ open: true, message: 'Order cancelled successfully', type: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'Failed to cancel order', type: 'error' });
    } finally {
      setCancelLoading(false);
    }
  };

  if (loading) return <CircularProgress sx={{ mt: 4, mx: 'auto', display: 'block' }} />;
  if (!order) return <Typography color="error">Order not found.</Typography>;

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', mt: 4, p: 2 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" fontWeight="bold" mb={2}>Order Details</Typography>
        <Typography variant="subtitle1" color="primary">Order ID: {order.orderId}</Typography>
        <Typography>Status: {order.status}</Typography>
        <Typography>Total: ₹{order.totalAmount?.toLocaleString()}</Typography>
        {order.status === 'PENDING' && (
          <Button
            variant="contained"
            color="error"
            sx={{ mt: 2 }}
            onClick={handleCancel}
            disabled={cancelLoading}
          >
            {cancelLoading ? 'Cancelling...' : 'Cancel Order'}
          </Button>
        )}
      </Paper>
      <Typography variant="h6" mb={2}>Order Items</Typography>
      {order.items.map((item, idx) => (
        <Paper key={idx} sx={{ p: 2, mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar variant="rounded" src={item.product.imageUrls?.[0] ? (item.product.imageUrls[0].startsWith('http') ? item.product.imageUrls[0] : `http://localhost:8081${item.product.imageUrls[0]}`) : undefined} alt={item.product.name} sx={{ width: 64, height: 64, bgcolor: '#f8f8f8', mr: 2 }} />
          <Box sx={{ flexGrow: 1 }}>
            <Typography fontWeight="bold">{item.product.name}</Typography>
            <Typography color="text.secondary">{item.product.categoryName}</Typography>
            <Typography variant="body2">{item.product.description}</Typography>
          </Box>
          <Stack alignItems="flex-end">
            <Typography>Qty: {item.quantity}</Typography>
            <Typography color="primary">₹{item.price?.toLocaleString()}</Typography>
          </Stack>
        </Paper>
      ))}
      <Divider sx={{ my: 3 }} />
      <Button onClick={() => navigate("/orders")}>Back to Orders</Button>
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.type} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
