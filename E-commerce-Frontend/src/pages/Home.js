import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useEffect, useState, useCallback } from "react";
import { getAllProducts } from "../api/productApi";
import ProductGrid from "../components/ProductGrid";
import SearchIcon from "@mui/icons-material/Search";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState({ cats: false, prods: false });
  const [error, setError] = useState({ cats: "", prods: "" });
  const [search, setSearch] = useState("");
  const token = localStorage.getItem("token");

  // Normalize products
  const normalizeProducts = useCallback(
    (arr) =>
      arr.map((p) => ({
        id: p.productId || p.id,
        name: p.name || "Unnamed Product",
        price: Number(p.price) || 0,
        description: p.description || "",
        stock: Number(p.stock) || 0,
        categoryName: p.categoryName || p.category || "",
        imageUrls: p.imageUrls?.length
          ? p.imageUrls
          : p.images?.map((img) => img.url) || [],
      })),
    []
  );

  // Search handler
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    setLoading((l) => ({ ...l, prods: true }));
    setError((er) => ({ ...er, prods: "" }));
    try {
      const res = await fetch(
        `http://localhost:8081/api/search/search?q=${encodeURIComponent(
          search.trim()
        )}`,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      if (!res.ok) throw new Error("Search failed");
      const data = await res.json();
      setProducts(normalizeProducts(data));
    } catch (err) {
      setError((er) => ({ ...er, prods: "No products found for search" }));
      setProducts([]);
    } finally {
      setLoading((l) => ({ ...l, prods: false }));
    }
  };

 useEffect(() => {
  const fetchProducts = async () => {
    setLoading((l) => ({ ...l, prods: true }));
    try {
      // ✅ pass sortBy and sortDir separately
      const res = await getAllProducts(0, 10, "price", "asc", token);

      const productsArr = Array.isArray(res.data.data)
        ? res.data.data
        : res.data.data?.content || [];

      setProducts(normalizeProducts(productsArr));
    } catch (e) {
      setError((er) => ({ ...er, prods: "Failed to load products" }));
    } finally {
      setLoading((l) => ({ ...l, prods: false }));
    }
  };
  fetchProducts();
}, [normalizeProducts, token]);


  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", px: 2, py: 4 }}>
      {/* Hero Section */}
      <Box className="home-hero">
        <Typography className="home-hero-title">
          Welcome to <span style={{ color: "#1565c0" }}>PrimeCart</span>
        </Typography>
        <Typography className="home-hero-desc">
          Discover premium products at the best prices. Shop smart, shop modern!
        </Typography>
        <Button
          variant="contained"
          className="home-hero-btn"
          color="primary"
          size="large"
        >
          Shop Now
        </Button>
      </Box>

      {/* Search Bar */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mb: 4,
        }}
      >
        <form
          onSubmit={handleSearch}
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          <TextField
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            size="medium"
            className="home-search-bar"
            InputProps={{
              sx: {
                borderRadius: "12px",
                bgcolor: "#fff",
                boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
              },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton type="submit" color="primary">
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </form>
      </Box>

      {/* Featured Products */}
      <Typography
        variant="h4"
        sx={{ mb: 3, fontWeight: 700, textAlign: "center", color: "#333" }}
      >
        Featured Products
      </Typography>
      <ProductGrid
        products={products}
        loading={loading.prods}
        error={error.prods}
      />
    </Box>
  );
}

export default Home;
