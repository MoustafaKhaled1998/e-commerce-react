import Product from "../products/Product";
import "./ProductList.css";
import { useProducts } from "../../hooks";
import { useSearch } from "../../context/SearchContext";

export default function ProductList() {
  const { products, loading, error } = useProducts();
  const { searchTerm } = useSearch();

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading products...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {filteredProducts.length === 0 && searchTerm ? (
        <div className="alert alert-info text-center">
          No products found for "{searchTerm}"
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
          {filteredProducts.map(product => (
            <div key={product.id} className="col">
              <Product product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
