import ReactStars from "react-stars";
import "./Products.css";
import { useCart } from "../../context/CartContext";
import { useApp } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Product({ product }) {
  const { cart, addToCart, updateQuantity } = useCart();
  const { isAuthenticated } = useApp();
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  const quantity = cart[product.id]?.quantity || 0;

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    addToCart(product.id, product);
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
        e.target.closest(".quantity-btn")) {
      return;
    }
    navigate(`/card-details/${product.id}`);
  };

  return (
    <>
      <div className="card h-100 product-card product-clickable" onClick={handleCardClick}>
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
          <h5 className="text-danger mb-0">${product.price}</h5>
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
      <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
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
