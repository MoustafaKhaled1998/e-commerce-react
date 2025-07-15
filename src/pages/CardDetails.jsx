import { useParams, Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useApp } from "../context/AppContext";
import { useProduct } from "../hooks";
import ReactStars from "react-stars";
import "../components/products/Products.css";
import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { addToWishlist, removeFromWishlist } from '../redux/wishlistSlice';

export default function CardDetails() {
  const { id } = useParams();
  const { cart, addToCart, updateQuantity } = useCart();
  const { isAuthenticated } = useApp();
  const navigate = useNavigate();
  const { product, loading, error } = useProduct(id);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const dispatch = useDispatch();
  const wishlistItems = useSelector(state => state.wishlist.items);
  const isInWishlist = wishlistItems.some(item => item.id === product?.id);

  const cartItem = cart[id];
  const quantity = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    addToCart(product.id, product);
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity <= product.stock) {
      updateQuantity(product.id, newQuantity);
    }
  };

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    if (!product) return;
    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id));
    } else {
      dispatch(addToWishlist({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.thumbnail
      }));
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
    <>
      <div className="container py-5">
        <div className="mb-4">
          <Link to="/" className="btn btn-outline-primary">
            ← Back to Home
          </Link>
        </div>
        <div className="row align-items-stretch carddetails-row-minheight">
          <div className="col-lg-6 mb-4 h-100 d-flex carddetails-img-col position-relative">
            <button
              className="wishlist-icon-btn position-absolute wishlist-icon-top-right"
              onClick={handleWishlistToggle}
              aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              {isInWishlist ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#ff4757" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff4757" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              )}
            </button>
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
      {showLoginModal && (
        <div className="modal fade show d-block login-modal-overlay">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Login Required</h5>
                <button type="button" className="btn-close" onClick={() => setShowLoginModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>You need to be logged in to add items to your cart.</p>
                <p className="text-muted small">Please log in or create an account to continue.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowLoginModal(false)}>
                  Cancel
                </button>
                <Link to="/login" className="btn btn-primary" onClick={() => setShowLoginModal(false)}>
                  Login
                </Link>
                <Link to="/register" className="btn btn-outline-primary" onClick={() => setShowLoginModal(false)}>
                  Register
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 