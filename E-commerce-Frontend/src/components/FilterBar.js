



import { Box, Paper, MenuItem, Select, InputLabel, FormControl, Button, Stack } from "@mui/material";
import "../App.css";



export default function FilterBar({
  categories,
  activeCategory,
  onCategoryChange,
  minPrice,
  maxPrice,
  onMinChange,
  onMaxChange,
  onFilter,
  onClear
}) {
  return (
    <Paper className="minimal-form" sx={{ mb: 3, p: 2, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', bgcolor: '#fafbfc', borderRadius: 3, boxShadow: 1 }}>
      <FormControl size="small" sx={{ minWidth: 180 }}>
        <InputLabel>Category</InputLabel>
        <Select
          value={activeCategory || ''}
          label="Category"
          onChange={e => onCategoryChange(e.target.value)}
        >
          <MenuItem value="">All Categories</MenuItem>
          {categories.map((cat) => (
            <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Min Price</InputLabel>
        <Select
          value={minPrice || ''}
          label="Min Price"
          onChange={e => onMinChange(e.target.value)}
        >
          <MenuItem value="">No Min</MenuItem>
          <MenuItem value={100}>100</MenuItem>
          <MenuItem value={500}>500</MenuItem>
          <MenuItem value={1000}>1000</MenuItem>
          <MenuItem value={5000}>5000</MenuItem>
        </Select>
      </FormControl>
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Max Price</InputLabel>
        <Select
          value={maxPrice || ''}
          label="Max Price"
          onChange={e => onMaxChange(e.target.value)}
        >
          <MenuItem value="">No Max</MenuItem>
          <MenuItem value={500}>500</MenuItem>
          <MenuItem value={1000}>1000</MenuItem>
          <MenuItem value={5000}>5000</MenuItem>
          <MenuItem value={10000}>10000</MenuItem>
        </Select>
      </FormControl>
      <Stack direction="row" spacing={1}>
        <Button variant="contained" color="primary" className="minimal-btn" onClick={onFilter}>Apply</Button>
        <Button variant="outlined" color="secondary" className="minimal-btn" onClick={onClear}>Clear</Button>
      </Stack>
    </Paper>
  );
}
