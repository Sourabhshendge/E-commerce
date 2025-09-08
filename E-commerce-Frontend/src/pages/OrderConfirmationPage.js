import React from "react";
import { Box, Typography, Paper, Divider, Stack, Avatar, Button } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

export default function OrderConfirmationPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const order = state?.order;

  if (!order) {
    return <Typography color="error">No order details found.</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', mt: 4, p: 2 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" mb={2}>Order Placed!</Typography>
        <Typography variant="subtitle1" color="primary">Order ID: {order.orderId}</Typography>
        <Typography>Status: {order.status}</Typography>
        <Typography>Total: ₹{order.totalAmount?.toLocaleString()}</Typography>
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
      <Button variant="contained" color="primary" onClick={() => navigate("/orders")}>View My Orders</Button>
      <Button sx={{ ml: 2 }} onClick={() => navigate("/")}>Continue Shopping</Button>
    </Box>
  );
}
