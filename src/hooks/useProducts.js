import { useState, useEffect } from 'react';
import axios from '../utils/axios';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    axios.get("https://dummyjson.com/products")
      .then(res => setProducts(res.data.products || []))
      .catch(() => setError("Failed to load products."))
      .finally(() => setLoading(false));
  }, []);

  return { 
    products, 
    loading, 
    error
  };
}; 