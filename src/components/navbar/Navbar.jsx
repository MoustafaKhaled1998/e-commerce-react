import "./Navbar.css";
import { useCart } from "../../context/CartContext";
import { useApp } from "../../context/AppContext";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Navbar({ onSearch }) {
  const { total } = useCart();
  const { user, isAuthenticated, logout } = useApp();
  const location = useLocation();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const handleCartClick = (e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      setShowLoginModal(true);
    }
  };

  if (["/login", "/register"].includes(location.pathname)) {
    return null;
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">
            FashionHub
          </Link>
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <div className="navbar-nav me-auto">
              <Link className="nav-link" to="/">Home</Link>
              {!isAuthenticated ? (
                <>
                  <Link className="nav-link" to="/register">Register</Link>
                  <Link className="nav-link" to="/login">Login</Link>
                </>
              ) : (
                <div className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                    {user?.username || user?.email}
                  </a>
                  <ul className="dropdown-menu">
                    <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
                  </ul>
                </div>
              )}
            </div>
            <div className="d-flex align-items-center gap-3">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="form-control"
                  onChange={(e) => onSearch(e.target.value)}
                />
              </div>
              <Link 
                to="/cart" 
                className="btn btn-outline-light position-relative d-flex align-items-center p-1 cart-btn"
                onClick={handleCartClick}
              >
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/891/891462.png" 
                  alt="cart" 
                  className="cart-icon me-1"
                />
                <span className="cart-label">Cart</span>
                {total > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger cart-badge">
                    {total}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {showLoginModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Login Required</h5>
                <button type="button" className="btn-close" onClick={() => setShowLoginModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>You need to be logged in to access the cart.</p>
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