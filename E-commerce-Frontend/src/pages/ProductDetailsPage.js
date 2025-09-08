import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../api/productApi";
import ProductDetailsView from "../components/ProductDetailsView";
import { Box, CircularProgress, Typography } from "@mui/material";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await getProductById(id, token);
        const p = res.data.data;
        setProduct({
          id: p.productId || p.id,
          name: p.name || "Unnamed Product",
          price: Number(p.price) || 0,
          description: p.description || "",
          stock: Number(p.stock) || 0,
          categoryName: p.categoryName || (p.category && p.category.name) || "",
          imageUrls: p.imageUrls?.length
            ? p.imageUrls
            : p.images?.map((img) => img.url) || [],
        });
      } catch (e) {
        setError("Product not found");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <CircularProgress sx={{ mt: 4 }} />;
  if (error) return <Typography color="error" sx={{ mt: 4 }}>{error}</Typography>;
  if (!product) return null;

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", mt: 4 }}>
      <ProductDetailsView product={product} />
    </Box>
  );
}
