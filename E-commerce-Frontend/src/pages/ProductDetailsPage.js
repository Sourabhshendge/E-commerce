import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById, getRecommendations } from "../api/productApi";
import ProductDetailsView from "../components/ProductDetailsView";
import ProductCard from "../components/ProductCard";
import { Box, CircularProgress, Typography } from "@mui/material";


export default function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [recLoading, setRecLoading] = useState(false);
  const [recError, setRecError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await getProductById(id, token);
        const p = res.data.data;
        const prodObj = {
          id: p.productId || p.id,
          name: p.name || "Unnamed Product",
          price: Number(p.price) || 0,
          description: p.description || "",
          stock: Number(p.stock) || 0,
          categoryName: p.categoryName || (p.category && p.category.name) || "",
          imageUrls: p.imageUrls?.length
            ? p.imageUrls
            : p.images?.map((img) => img.url) || [],
        };
        setProduct(prodObj);

        // Fetch recommendations
        setRecLoading(true);
        setRecError("");
        try {
          const recRes = await getRecommendations(prodObj.name, localStorage.getItem("token"));
          setRecommendations(recRes.data);
        } catch (err) {
          setRecError("Could not load recommendations");
        } finally {
          setRecLoading(false);
        }
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
      {/* Recommended Products Section */}
      <Box sx={{ mt: 5 }}>
        <Typography variant="h6" fontWeight="bold" mb={2}>Recommended for you</Typography>
        {recLoading ? (
          <CircularProgress size={24} />
        ) : recError ? (
          <Typography color="error">{recError}</Typography>
        ) : recommendations.length ? (
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            {recommendations.map((rec) => (
              <ProductCard
                key={rec.productId || rec.id}
                product={{
                  ...rec,
                  id: rec.productId || rec.id,
                  price: Number(rec.price) || 0,
                }}
                showLike={false}
                onView={(id) => window.location.assign(`/product/${id}`)}
              />
            ))}
          </Box>
        ) : (
          <Typography color="text.secondary">No recommendations found.</Typography>
        )}
      </Box>
    </Box>
  );
}
