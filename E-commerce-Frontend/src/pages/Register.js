import { useState } from "react";
import { Snackbar, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { registerUser, verifyOtp } from "../api/authApi";
import { Container, TextField, Button, Typography, Box } from "@mui/material";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", phoneNumber: "" });
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("register"); 
  const [snackbar, setSnackbar] = useState({ open: false, message: "", type: "success" });
  const navigate = useNavigate(); // ✅ for navigation

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await registerUser(form);
      setSnackbar({ open: true, message: "OTP sent to your email!", type: "success" });
      setStep("verify");
    } catch (err) {
      setSnackbar({ open: true, message: "Registration failed: " + (err.response?.data?.message || err.message), type: "error" });
    }
  };

  const handleVerifyOtp = async () => {
    try {
      await verifyOtp({ email: form.email, otp });
      setSnackbar({ open: true, message: "OTP verified! Now you can login.", type: "success" });
      setStep("done");
    } catch (err) {
      setSnackbar({ open: true, message: "OTP verification failed: " + (err.response?.data?.message || err.message), type: "error" });
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, p: 4, boxShadow: 3, borderRadius: 3, bgcolor: '#fff', maxWidth: 420, mx: 'auto' }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ color: 'primary.main', mb: 3 }}>
          {step === "register" ? "Register" : step === "verify" ? "Verify OTP" : "Success 🎉"}
        </Typography>

        {/* STEP 1: Register */}
        {step === "register" && (
          <form onSubmit={handleRegister}>
            <TextField
              fullWidth margin="normal" label="Name" name="name"
              value={form.name} onChange={handleChange}
              variant="outlined"
              size="small"
            />
            <TextField
              fullWidth margin="normal" label="Email" name="email"
              value={form.email} onChange={handleChange}
              variant="outlined"
              size="small"
            />
            <TextField
              fullWidth margin="normal" type="password" label="Password" name="password"
              value={form.password} onChange={handleChange}
              variant="outlined"
              size="small"
            />
            <TextField
              fullWidth margin="normal" type="text" label="Phone number" name="phoneNumber"
              value={form.phoneNumber} onChange={handleChange}
              variant="outlined"
              size="small"
            />

            <Box textAlign="center" mt={2}>
              <Button type="submit" variant="contained" color="primary" size="medium" sx={{ borderRadius: 2, fontWeight: 600, py: 1 }}>
                Register
              </Button>
            </Box>
          </form>
        )}

        {/* STEP 2: OTP Verification */}
        {step === "verify" && (
          <Box textAlign="center">
            <TextField
              fullWidth margin="normal" label="Enter OTP"
              value={otp} onChange={(e) => setOtp(e.target.value)}
              variant="outlined"
              size="small"
            />
            <Button onClick={handleVerifyOtp} variant="contained" color="success" size="medium" sx={{ borderRadius: 2, fontWeight: 600, py: 1, mt: 1 }}>
              Verify OTP
            </Button>
          </Box>
        )}

        {/* STEP 3: Success */}
        {step === "done" && (
          <Box textAlign="center">
            <Typography variant="h6" color="green" gutterBottom>
              ✅ Registration successful!
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => navigate("/login")}
              sx={{ borderRadius: 2, fontWeight: 600, py: 1 }}
            >
              Go to Login
            </Button>
          </Box>
        )}
      </Box>
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.type} sx={{ width: "100%" }}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
}
