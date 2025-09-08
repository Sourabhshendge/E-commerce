import { Box, Typography, Button, TextField, InputAdornment, IconButton } from "@mui/material";
import { useEffect, useState, useCallback, useRef } from "react";
import { getAllProducts } from "../api/productApi";
import ProductGrid from "../components/ProductGrid";
import SearchIcon from '@mui/icons-material/Search';

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState({ cats: false, prods: false });
  const [error, setError] = useState({ cats: "", prods: "" });
  const [search, setSearch] = useState("");
  // Helper to normalize product data
  const normalizeProducts = useCallback((arr) => arr.map((p) => ({
    id: p.productId || p.id,
    name: p.name || "Unnamed Product",
    price: Number(p.price) || 0,
    description: p.description || "",
    stock: Number(p.stock) || 0,
    categoryName: p.categoryName || p.category || "",
    imageUrls: p.imageUrls?.length
      ? p.imageUrls
      : p.images?.map((img) => img.url) || [],
  })), []);


  // Search handler for Elasticsearch
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    setLoading((l) => ({ ...l, prods: true }));
    setError((er) => ({ ...er, prods: "" }));
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8081/api/search/search?q=${encodeURIComponent(search.trim())}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
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

  // Products (fetch only on mount)
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading((l) => ({ ...l, prods: true }));
      try {
        const token = localStorage.getItem("token");
        const res = await getAllProducts(0, 4, "productId,desc", token);
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
  }, [normalizeProducts]);

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", px: 2, py: 4 }}>
      {/* Hero Section */}
      <Box className="home-hero">
        <Typography className="home-hero-title">
          Welcome to MyShop
        </Typography>
        <Typography className="home-hero-desc">
          Discover the latest products, shop by category, and enjoy a seamless shopping experience. Use the search below to find exactly what you need!
        </Typography>
        <Button
          className="home-hero-btn"
          variant="contained"
          color="primary"
          onClick={() => window.scrollTo({ top: 400, behavior: 'smooth' })}
        >
          Shop Now
        </Button>
      </Box>

      {/* Search Bar */}
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <form onSubmit={handleSearch} style={{ width: '100%', maxWidth: 500 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search for products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton type="submit" color="primary">
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </form>
      </Box>

      {/* Products */}
      <Typography variant="h5" sx={{ my: 3 }}>
        Latest Products
      </Typography>
      <ProductGrid products={products} loading={loading.prods} error={error.prods} />
    </Box>
  );
}

export default Home;
