import { useParams, Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useProduct } from "../hooks";
import ReactStars from "react-stars";
import "../components/products/Products.css";

export default function CardDetails() {
  const { id } = useParams();
  const { cart, addToCart, updateQuantity } = useCart();
  const navigate = useNavigate();
  const { product, loading, error } = useProduct(id);

  const cartItem = cart[id];
  const quantity = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    addToCart(product.id, product);
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity <= product.stock) {
      updateQuantity(product.id, newQuantity);
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h2 className="mt-3">Loading product details...</h2>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <h2>Product Details</h2>
          <p className="text-danger">{error || "Product not found."}</p>
          <Link to="/" className="btn btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="mb-4">
        <Link to="/" className="btn btn-outline-primary">
          ← Back to Home
        </Link>
      </div>
      
      <div className="row align-items-stretch" style={{ minHeight: '350px' }}>
        <div className="col-lg-6 mb-4 h-100 d-flex carddetails-img-col">
          <img 
            src={product.thumbnail} 
            alt={product.title} 
            className="img-fluid rounded shadow product-img carddetails-img-full m-auto"
          />
        </div>
        
        <div className="col-lg-6 h-100 d-flex flex-column justify-content-between">
          <div>
            <h1 className="mb-3 text-dark">{product.title}</h1>
            <div className="mb-3 d-flex align-items-center">
              <ReactStars
                count={5}
                value={product.rating || 0}
                size={24}
                color1="#d3d3d3"
                color2="#ffd700"
                half={true}
                edit={false}
              />
              {product.rating && (
                <span className="ms-2 text-muted">
                  ({product.rating.toFixed(1)})
                </span>
              )}
            </div>
            <h2 className="text-danger mb-3">${product.price}</h2>
            <p className="text-muted mb-3">
              <strong>Stock:</strong> {product.stock} items available
            </p>
            <p className="mb-4 lh-base">
              {product.description}
            </p>
            <div className="mb-4">
              <p className="mb-2">
                <strong>Brand:</strong> {product.brand}
              </p>
              <p className="mb-2">
                <strong>Category:</strong> {product.category}
              </p>
              {product.discountPercentage && (
                <p className="mb-2 text-success">
                  <strong>Discount:</strong> {product.discountPercentage}% off
                </p>
              )}
            </div>
          </div>
          <div>
            {quantity === 0 ? (
              <button 
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`btn ${product.stock === 0 ? 'btn-secondary' : 'btn-primary'} btn-lg w-100 carddetails-btn-maxw`}
              >
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            ) : (
              <div className="d-flex align-items-center gap-3">
                <div className="input-group carddetails-qty-group">
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={() => handleQuantityChange(quantity - 1)}
                  >
                    -
                  </button>
                  <span className="form-control text-center">
                    {quantity}
                  </span>
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
                <span className="text-success fw-bold">
                  {quantity} in cart
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {product.images && product.images.length > 1 && (
        <div className="mt-5">
          <h3 className="mb-3">More Images</h3>
          <div className="d-flex gap-2 overflow-auto pb-2">
            {product.images.map((image, index) => (
              <img 
                key={index}
                src={image} 
                alt={`${product.title} ${index + 1}`}
                className="img-thumbnail carddetails-thumb"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 