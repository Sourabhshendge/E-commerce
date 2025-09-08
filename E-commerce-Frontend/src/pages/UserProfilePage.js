import { useEffect, useState, useCallback } from "react";
import { getUserById } from "../api/userApi"; // API call to fetch user info
import {
  Container,
  Typography,
  Paper,
  Box,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function UserProfile() {
  const { user, logout } = useAuth(); // decoded JWT
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

useEffect(() => {
  let isMounted = true;

  const fetchUser = async () => {
    if (!user?.userId) return;

    const token = localStorage.getItem("token");
    if (!token) {
      if (isMounted) setError("No token found. Please login.");
      return;
    }

    if (isMounted) setLoading(true);
    try {
      const res = await getUserById(user.userId, token);
      if (isMounted) setUserInfo(res.data);
    } catch (err) {
      console.error(err);
      if (isMounted) setError("Failed to fetch user info.");
    } finally {
      if (isMounted) setLoading(false);
    }
  };

  fetchUser();

  return () => {
    isMounted = false; // ✅ cancel updates on unmount
  };
}, [user]);


const handleLogout = useCallback(() => {
  logout();              // clears token and user
  setUserInfo(null);      // optional: clear local state immediately
  navigate("/login");     // navigate safely
}, [logout, navigate]);

  if (loading)
    return <CircularProgress sx={{ mt: 4, display: "block", mx: "auto" }} />;

  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container sx={{ mt: 4, maxWidth: 480 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: 'primary.main', mb: 3 }}>
        User Profile
      </Typography>

      {userInfo && (
        <Paper elevation={2} sx={{ p: 4, borderRadius: 3, boxShadow: 3, bgcolor: '#fff' }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" color="text.secondary">Email</Typography>
            <Typography sx={{ fontSize: 18 }}>{userInfo.email}</Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" color="text.secondary">Mobile Number</Typography>
            <Typography sx={{ fontSize: 18 }}>{userInfo.phoneNumber}</Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" color="text.secondary">User ID</Typography>
            <Typography sx={{ fontSize: 18 }}>{userInfo.id || user.userId}</Typography>
          </Box>

          <Button variant="contained" color="secondary" onClick={handleLogout} sx={{ borderRadius: 2, fontWeight: 600, py: 1, mt: 2 }}>
            Logout
          </Button>
        </Paper>
      )}
    </Container>
  );
}
