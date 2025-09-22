import { Box, Typography, Link, Stack, Divider } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "primary.main",
        color: "white",
        mt: 4,
        py: 4,
        px: { xs: 2, md: 4 },
        textAlign: "center",
      }}
    >
      <Typography variant="h6" fontWeight={700} gutterBottom>
        PrimeCart
      </Typography>
      <Typography variant="body2" sx={{ maxWidth: 600, mx: "auto", mb: 2 }}>
        Shop smarter, faster, and easier with PrimeCart. Explore top products and unbeatable deals at your fingertips.
      </Typography>
      <Stack
        direction="row"
        spacing={2}
        justifyContent="center"
        divider={<Divider orientation="vertical" flexItem sx={{ bgcolor: "white" }} />}
      >
        <Link href="/privacy" color="inherit" underline="hover">
          Privacy Policy
        </Link>
        <Link href="/terms" color="inherit" underline="hover">
          Terms of Service
        </Link>
        <Link href="/help" color="inherit" underline="hover">
          Help Center
        </Link>
      </Stack>
      <Typography variant="caption" sx={{ display: "block", mt: 3 }}>
        © {new Date().getFullYear()} PrimeCart. All rights reserved.
      </Typography>
    </Box>
  );
}
