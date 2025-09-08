import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { addToCart, getCart, removeFromCart } from "../api/cartApi";
import { placeOrder } from "../api/orderApi";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const { user } = useAuth();
  // Try to load cart from localStorage first
  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem('cart');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch cart on login
  useEffect(() => {
    if (user?.userId) {
      fetchCart(user.userId);
    } else {
      setCart(null);
      localStorage.removeItem('cart');
    }
    // eslint-disable-next-line
  }, [user?.userId]);

  const fetchCart = useCallback(async (userId) => {
    setLoading(true);
    setError("");
    try {
      const res = await getCart(userId);
      setCart(res.data.data);
      localStorage.setItem('cart', JSON.stringify(res.data.data));
    } catch (err) {
      setError("Failed to fetch cart");
      setCart(null);
      localStorage.removeItem('cart');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAddToCart = async (productId, quantity = 1) => {
    if (!user?.userId) return;
    setLoading(true);
    setError("");
    try {
      const res = await addToCart(user.userId, productId, quantity);
      setCart(res.data.data);
      localStorage.setItem('cart', JSON.stringify(res.data.data));
    } catch (err) {
      setError("Failed to add to cart");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromCart = async (productId) => {
    if (!user?.userId) return;
    setLoading(true);
    setError("");
    try {
      await removeFromCart(user.userId, productId);
      // Refetch cart after removal
      await fetchCart(user.userId);
    } catch (err) {
      setError("Failed to remove from cart");
    } finally {
      setLoading(false);
    }
  };

  // Place order and clear cart on success
  const handlePlaceOrder = async () => {
    if (!user?.userId) return null;
    setLoading(true);
    setError("");
    try {
      const res = await placeOrder(user.userId);
      setCart(null); // Clear cart after order
      localStorage.removeItem('cart');
      return res.data.data;
    } catch (err) {
      setError("Failed to place order");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = () => {
    setCart(null);
    localStorage.removeItem('cart');
  };

  // Memoize context value to avoid unnecessary re-renders
  const contextValue = useMemo(() => ({
    cart,
    loading,
    error,
    fetchCart,
    addToCart: handleAddToCart,
    removeFromCart: handleRemoveFromCart,
    placeOrder: handlePlaceOrder,
    clearCart,
  }), [cart, loading, error, fetchCart, handleAddToCart, handleRemoveFromCart, handlePlaceOrder, clearCart]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}
