import { useState, useEffect } from 'react';
import axios from '../utils/axios';

export const useProduct = (productId = null) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    axios.get(`https://dummyjson.com/products/${productId}`)
      .then(res => setProduct(res.data))
      .catch(() => setError("Failed to load product details."))
      .finally(() => setLoading(false));
  }, [productId]);

  return { product, loading, error };
}; 