import { Box, Chip, CircularProgress, Typography } from "@mui/material";

export default function CategoryChips({ categories, activeCategory, onSelect, loading, error }) {
  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  return (
    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
      {categories.map((cat) => (
        <Chip
          key={cat.id}
          label={cat.name}
          color={activeCategory === cat.id ? "secondary" : "primary"}
          variant={activeCategory === cat.id ? "filled" : "outlined"}
          onClick={() => onSelect(cat.id)}
          sx={{ fontSize: 16, px: 2, cursor: "pointer" }}
        />
      ))}
    </Box>
  );
}
