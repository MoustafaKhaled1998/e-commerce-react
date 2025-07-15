import ReactStars from "react-stars";
import "./Products.css";
import { useCart } from "../../context/CartContext";
import { useApp } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { addToWishlist, removeFromWishlist } from '../../redux/wishlistSlice';

export default function Product({ product }) {
  const { cart, addToCart, updateQuantity } = useCart();
  const { isAuthenticated } = useApp();
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const dispatch = useDispatch();
  const wishlistItems = useSelector(state => state.wishlist.items);
  
  const quantity = cart[product.id]?.quantity || 0;

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    addToCart(product.id, product);
  };

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    if (wishlistItems.some(item => item.id === product.id)) {
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

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 0 && newQuantity <= product.stock) {
      if (newQuantity === 0) {
        updateQuantity(product.id, 0);
      } else {
        updateQuantity(product.id, newQuantity);
      }
    }
  };

  const handleCardClick = (e) => {
    if (e.target.closest(".btnAddCart") || 
        e.target.closest(".quantity-controls") || 
        e.target.closest(".quantity-btn") ||
        e.target.closest(".btnAddWishlist")) {
      return;
    }
    navigate(`/card-details/${product.id}`);
  };

  const isInWishlist = wishlistItems.some(item => item.id === product.id);

  return (
    <>
      <div className="card h-100 product-card product-clickable position-relative" onClick={handleCardClick}>
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
          className="card-img-top p-3 product-img"
          onError={e => { e.target.src = 'https://via.placeholder.com/150x150?text=No+Image'; }}
        />
        <div className="card-body d-flex flex-column">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <h6 className="card-title mb-0 text-truncate product-title">
              {product.title}
            </h6>
            <h5 className="product-price mb-0">${product.price}</h5>
          </div>
          <div className="d-flex align-items-center mb-2">
            <ReactStars
              count={5}
              value={product.rating || 0}
              size={20}
              color1="#d3d3d3"
              color2="#ffd700"
              half={true}
              edit={false}
            />
            {product.rating && (
              <small className="text-muted ms-1">
                ({product.rating.toFixed(1)})
              </small>
            )}
          </div>
          <p className="card-text small text-muted mb-3">
            {product.stock} items available in stock
          </p>
          <div className="mt-auto">
            {quantity === 0 ? (
              <button 
                className={`btn ${product.stock === 0 ? 'btn-secondary' : 'btn-primary'} w-100 btnAddCart`}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            ) : (
              <div className="quantity-controls d-flex align-items-center justify-content-center gap-2">
                <button 
                  className="quantity-btn"
                  onClick={e => { e.stopPropagation(); handleQuantityChange(quantity - 1); }}
                  title="Decrease quantity"
                >
                  -
                </button>
                <span className="quantity-display fw-bold">{quantity}</span>
                <button 
                  className="quantity-btn"
                  onClick={e => { e.stopPropagation(); handleQuantityChange(quantity + 1); }}
                  disabled={quantity >= product.stock}
                  title={quantity >= product.stock ? "Maximum stock reached" : "Increase quantity"}
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
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