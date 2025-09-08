
import React from "react";
import { createPaymentOrder, verifyPayment } from "../api/paymentApi";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Box, Typography, Paper, Button, Divider, CircularProgress, Chip, Stack, Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";

function buildImageUrl(url) {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `http://localhost:8081${url.startsWith("/") ? url : "/" + url}`;
}

function CartItem({ item, onRemove }) {
  const product = item.product || {};
  const imageUrl = product.imageUrls?.[0]
    ? buildImageUrl(product.imageUrls[0])
    : "https://via.placeholder.com/80x80?text=No+Image";
  return (
    <Paper sx={{ p: 2, mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
      <Avatar variant="rounded" src={imageUrl} alt={product.name} sx={{ width: 80, height: 80, bgcolor: '#f8f8f8', mr: 2 }} />
      <Box sx={{ flexGrow: 1 }}>
        <Typography fontWeight="bold" fontSize={18}>{product.name}</Typography>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
          {product.categoryName && <Chip label={product.categoryName} size="small" />}
          <Typography color="primary" fontWeight={600}>₹{product.price?.toLocaleString()}</Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          {product.description?.length > 60 ? product.description.slice(0, 60) + "..." : product.description}
        </Typography>
        <Typography variant="body2">Quantity: {item.quantity}</Typography>
      </Box>
      <Button color="error" variant="outlined" onClick={() => onRemove(product.productId)}>
        Remove
      </Button>
    </Paper>
  );
}


function CartSummary({ cart, onCheckout, checkoutLoading }) {
  // Calculate total price
  const total = (cart?.items || []).reduce(
    (sum, item) => sum + ((item.product?.price || 0) * item.quantity),
    0
  );
  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6">Cart Summary</Typography>
      <Typography>Total Items: {cart?.items?.length || 0}</Typography>
      <Typography fontWeight={600} color="primary.main" sx={{ mt: 1 }}>Total: ₹{total.toLocaleString()}</Typography>
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        onClick={onCheckout}
        disabled={checkoutLoading || !cart?.items?.length}
      >
        {checkoutLoading ? "Placing Order..." : "Checkout"}
      </Button>
    </Paper>
  );
}


function CartPage() {
  const { cart, loading, error, removeFromCart, placeOrder } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [checkoutLoading, setCheckoutLoading] = React.useState(false);
  const userId = user?.userId || "";
  const token = localStorage.getItem("token");

  if (loading) return <CircularProgress sx={{ mt: 4, mx: 'auto', display: 'block' }} />;
  if (error) return <Typography color="error">{error}</Typography>;

  // Razorpay payment handler
  const handleRazorpayPayment = async () => {
    if (!cart || !cart.items?.length) return;
    setCheckoutLoading(true);
    try {
      // Calculate total in rupees
      const total = cart.items.reduce((sum, item) => sum + ((item.product?.price || 0) * item.quantity), 0);
      // 1. Create order on backend
      const res = await createPaymentOrder(userId, total, token);
      const order = res.data;
      // 2. Open Razorpay checkout
      const options = {
        key: "rzp_test_RB4vopWfCS41ot",
        amount: order.amount, // in paise
        currency: order.currency,
        order_id: order.razorpayOrderId,
        handler: async function (response) {
          // 3. Verify payment on backend
          const verifyRes = await verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          }, token);
          if (verifyRes.data === "Payment verified & updated in DB") {
            // Place order in app after payment
            const placedOrder = await placeOrder();
            if (placedOrder) {
              navigate("/order-confirmation", { state: { order: placedOrder } });
            }
          } else {
            alert("Payment verification failed");
          }
        },
        prefill: {},
        theme: { color: "#1976d2" },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert("Payment failed: " + (err?.message || "Unknown error"));
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 2 }}>
      <Typography variant="h4" fontWeight="bold" mb={3}>My Cart</Typography>
      <Divider sx={{ mb: 2 }} />
      {cart?.items?.length ? (
        <>
          {cart.items.map((item) => (
            <CartItem key={item.cartItemId} item={item} onRemove={removeFromCart} />
          ))}
          {/* Razorpay payment button */}
          <Button
            variant="contained"
            color="secondary"
            sx={{ mt: 2, mb: 2, fontWeight: 600, fontSize: 18 }}
            onClick={handleRazorpayPayment}
            disabled={checkoutLoading}
            fullWidth
          >
            {checkoutLoading ? "Processing Payment..." : "Pay with Razorpay"}
          </Button>
          {/* Optionally keep the old checkout for COD or fallback */}
          {/* <CartSummary cart={cart} onCheckout={handleCheckout} checkoutLoading={checkoutLoading} /> */}
        </>
      ) : (
        <Typography color="text.secondary">Your cart is empty.</Typography>
      )}
      <Button sx={{ mt: 3 }} onClick={() => navigate("/")}>Continue Shopping</Button>
    </Box>
  );
}

export default CartPage;
