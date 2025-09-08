import { useState } from "react";
import { Snackbar, Alert } from "@mui/material";
import { loginUser } from "../api/authApi";
import { Container, TextField, Button, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", type: "success" });
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const res = await loginUser(form);
    const token = res.data.data.token;
    const userId = res.data.data.userId;
    if (!token) {
      throw new Error("Token not found in response");
    }
    localStorage.setItem("token", token);
    login(token, userId);
    setSnackbar({ open: true, message: "Login successful!", type: "success" });
    setTimeout(() => navigate("/"), 1000);
  } catch (err) {
    setSnackbar({ open: true, message: "Login failed: " + (err.response?.data?.message || err.message), type: "error" });
  }
};
  return (
    <Container maxWidth="sm">
      <Box
        sx={{ mt: 8, p: 4, boxShadow: 3, borderRadius: 3, bgcolor: '#fff', maxWidth: 420, mx: 'auto' }}
        textAlign={"center"}
      >
        <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', mb: 3 }}>
          Login
        </Typography>

        <form onSubmit={handleLogin}>
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            variant="outlined"
            size="small"
          />
          <TextField
            fullWidth
            margin="normal"
            type="password"
            label="Password"
            name="password"
            value={form.password}
            onChange={handleChange}
            variant="outlined"
            size="small"
          />

          <Box textAlign="center" mt={2}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="medium"
              sx={{ mr: 2, borderRadius: 2, fontWeight: 600, py: 1 }}
            >
              Login
            </Button>

            {/* New Register Button */}
            <Button
              variant="contained"
              color="secondary"
              size="medium"
              onClick={() => navigate("/register")}
              sx={{ borderRadius: 2, fontWeight: 600, py: 1 }}
            >
              Register
            </Button>
          </Box>
        </form>
      </Box>
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.type} sx={{ width: "100%" }}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
}
