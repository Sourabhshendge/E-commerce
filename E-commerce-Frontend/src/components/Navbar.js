import { AppBar, Toolbar, Typography, Button, IconButton, Box, Menu, MenuItem, Badge, Avatar, Divider } from "@mui/material";
import "../App.css";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { getAllCategories } from "../api/categoryApi";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorCat, setAnchorCat] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await getAllCategories(token);
        let cats = res.data;
        if (!Array.isArray(cats)) {
          if (cats && Array.isArray(cats.data)) {
            cats = cats.data;
          } else if (cats && Array.isArray(cats.content)) {
            cats = cats.content;
          } else {
            cats = [];
          }
        }
        setCategories(cats);
      } catch {
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);
  const [anchorUser, setAnchorUser] = useState(null);
  const { cart } = useCart();
  const cartCount = cart?.items?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 0;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
  <AppBar position="static" elevation={0} className="minimal-navbar" sx={{ color: "#222", borderBottom: 1, borderColor: "divider" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", minHeight: 64 }}>
        {/* Brand */}
        <Typography
          variant="h5"
          component={Link}
          to="/"
          sx={{ color: "primary.main", textDecoration: "none", fontWeight: "bold", letterSpacing: 1 }}
        >
          PrimeCart
        </Typography>

        {/* Navigation */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button component={Link} to="/" color="inherit" sx={{ fontWeight: 500 }}>Home</Button>
          <Button
            color="inherit"
            sx={{ fontWeight: 500 }}
            onClick={e => setAnchorCat(e.currentTarget)}
          >
            Categories
          </Button>
          <Button
            color="inherit"
            sx={{ fontWeight: 500 }}
            component={Link}
            to="/likes"
          >
            Wishlist
          </Button>
          <Menu
            anchorEl={anchorCat}
            open={Boolean(anchorCat)}
            onClose={() => setAnchorCat(null)}
          >
            {categories.length === 0 && (
              <MenuItem disabled>Loading...</MenuItem>
            )}
            {categories.map(cat => (
              <MenuItem
                key={cat.id}
                component={Link}
                to={`/categories/${cat.id}`}
                onClick={() => setAnchorCat(null)}
              >
                {cat.name}
              </MenuItem>
            ))}
          </Menu>
          {user && (
            <Button component={Link} to="/orders" color="inherit" sx={{ fontWeight: 500 }}>Orders</Button>
          )}
        </Box>

        {/* User/Cart */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton component={Link} to="/cart" size="large" sx={{ color: "primary.main" }}>
            <Badge badgeContent={cartCount} color="secondary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
          {user ? (
            <>
              <IconButton onClick={e => setAnchorUser(e.currentTarget)} size="large" sx={{ ml: 1 }}>
                <Avatar className="minimal-avatar" sx={{ width: 32, height: 32 }}>
                  <AccountCircleIcon />
                </Avatar>
              </IconButton>
              <Menu anchorEl={anchorUser} open={Boolean(anchorUser)} onClose={() => setAnchorUser(null)}>
                <MenuItem component={Link} to="/user" onClick={() => setAnchorUser(null)}>Profile</MenuItem>
                <Divider />
                <MenuItem onClick={() => { setAnchorUser(null); handleLogout(); }}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button component={Link} to="/login" color="primary" variant="outlined" className="minimal-btn" sx={{ ml: 1 }}>Login</Button>
              <Button component={Link} to="/register" color="primary" variant="contained" className="minimal-btn" sx={{ ml: 1 }}>Register</Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
