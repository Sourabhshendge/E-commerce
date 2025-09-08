import { TextField, Button } from "@mui/material";

export default function PriceFilter({ minPrice, maxPrice, onMinChange, onMaxChange, onFilter, onClear }) {
  return (
    <form onSubmit={onFilter} style={{ marginBottom: 24, display: 'flex', gap: 8 }}>
      <TextField
        label="Min Price"
        type="number"
        value={minPrice}
        onChange={e => onMinChange(e.target.value)}
        size="small"
        sx={{ width: 120 }}
      />
      <TextField
        label="Max Price"
        type="number"
        value={maxPrice}
        onChange={e => onMaxChange(e.target.value)}
        size="small"
        sx={{ width: 120 }}
      />
      <Button type="submit" variant="contained">Filter</Button>
      {(minPrice || maxPrice) && (
        <Button onClick={onClear} color="secondary">Clear</Button>
      )}
    </form>
  );
}
