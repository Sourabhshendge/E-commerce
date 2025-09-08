import { TextField, Button, InputAdornment } from "@mui/material";

export default function SearchBar({ value, onChange, onSearch, onClear }) {
  return (
    <form onSubmit={onSearch} style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
      <TextField
        placeholder="Search products..."
        value={value}
        onChange={e => onChange(e.target.value)}
        size="small"
        sx={{ width: 300 }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Button type="submit" variant="contained">Search</Button>
            </InputAdornment>
          )
        }}
      />
      {value && (
        <Button onClick={onClear} color="secondary">Clear</Button>
      )}
    </form>
  );
}
