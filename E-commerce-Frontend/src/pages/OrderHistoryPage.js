import React, { useEffect, useState, useMemo } from "react";
import { Box, Typography, Paper, Divider, Button, CircularProgress, Stack, Avatar } from "@mui/material";
import { getUserOrders } from "../api/orderApi";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const OrderHistoryPage = React.memo(function OrderHistoryPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.userId) return;
    setLoading(true);
    setError("");
    getUserOrders(user.userId)
      .then(res => setOrders(res.data.data || []))
      .catch(() => setError("Failed to fetch orders"))
      .finally(() => setLoading(false));
  }, [user?.userId]);

  // Memoize visible orders
  const visibleOrders = useMemo(() => orders.filter(order => order.status !== 'CANCELLED'), [orders]);

  if (loading) return <CircularProgress sx={{ mt: 4, mx: 'auto', display: 'block' }} />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 2 }}>
      <Typography variant="h4" fontWeight="bold" mb={3}>My Orders</Typography>
      <Divider sx={{ mb: 2 }} />
      {visibleOrders.length === 0 ? (
        <Typography color="text.secondary">You have no orders yet.</Typography>
      ) : (
        visibleOrders.map((order) => (
          <Paper key={order.orderId} sx={{ p: 2, mb: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography fontWeight="bold">Order ID: {order.orderId}</Typography>
                <Typography>Status: {order.status}</Typography>
                <Typography>Total: ₹{order.totalAmount?.toLocaleString()}</Typography>
              </Box>
              <Button variant="outlined" onClick={() => navigate(`/orders/${order.orderId}`)}>View Details</Button>
            </Stack>
            <Divider sx={{ my: 1 }} />
            <Stack direction="row" spacing={2}>
              {order.items?.slice(0, 3).map((item, idx) => (
                <Avatar key={idx} variant="rounded" src={item.product.imageUrls?.[0] ? (item.product.imageUrls[0].startsWith('http') ? item.product.imageUrls[0] : `http://localhost:8081${item.product.imageUrls[0]}`) : undefined} alt={item.product.name} sx={{ width: 56, height: 56, bgcolor: '#f8f8f8' }} />
              ))}
              {order.items?.length > 3 && <Typography>+{order.items.length - 3} more</Typography>}
            </Stack>
          </Paper>
        ))
      )}
    </Box>
  );
});

export default OrderHistoryPage;
