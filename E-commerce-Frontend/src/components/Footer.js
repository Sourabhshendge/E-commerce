import { Box, Typography, Link } from "@mui/material";

export default function Footer() {
  return (
    <Box
      sx={{
        bgcolor: "primary.main",
        color: "white",
        mt: 4,
        py: 3,
        textAlign: "center",
      }}
    >
      <Typography variant="body1">
        © {new Date().getFullYear()} MyShop. All rights reserved.
      </Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>
        <Link href="/privacy" color="inherit" underline="hover">Privacy Policy</Link> |{" "}
        <Link href="/terms" color="inherit" underline="hover">Terms of Service</Link>
      </Typography>
    </Box>
  );
}
