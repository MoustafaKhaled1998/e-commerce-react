import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import "../components/products/Products.css";

export default function Cart() {
  const { cart, updateQuantity } = useCart();
  const items = Object.values(cart);

  const totalPrice = items.reduce((sum, { product, quantity }) => sum + (product.price * quantity), 0);

  const handleRemove = (productId) => {
    updateQuantity(productId, 0);
  };

  const handleQuantity = (productId, newQuantity, stock) => {
    if (newQuantity > 0 && newQuantity <= stock) {
      updateQuantity(productId, newQuantity);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <h2 className="text-center mb-4">Shopping Cart</h2>
          {items.length === 0 ? (
            <div className="text-center">
              <div className="alert alert-info">
                <h4 className="alert-heading">Your cart is empty!</h4>
                <p>Start shopping to add items to your cart.</p>
              </div>
              <Link to="/" className="btn btn-primary">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="card shadow-sm">
              <div className="card-body">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="cart-item-row">
                    <div style={{width: '80px', flexShrink: 0}}>
                      <img src={product.thumbnail} alt={product.title} className="cart-img-thumb" />
                    </div>
                    <div className="cart-item-content">
                      <h5 className="cart-item-title">{product.title}</h5>
                      <div className="cart-item-controls">
                        <div className="input-group cart-qty-group">
                          <button 
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => handleQuantity(product.id, quantity - 1, product.stock)}
                            disabled={quantity <= 1}
                          >
                            -
                          </button>
                          <span className="form-control text-center p-1 cart-qty-span">{quantity}</span>
                          <button 
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => handleQuantity(product.id, quantity + 1, product.stock)}
                            disabled={quantity >= product.stock}
                          >
                            +
                          </button>
                        </div>
                        <button 
                          className="btn btn-danger btn-sm ms-2"
                          onClick={() => handleRemove(product.id)}
                        >
                          Remove
                        </button>
                        <div className="text-end ms-3 cart-item-price">
                          ${(product.price * quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="card-footer">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Total: <span className="text-success">${totalPrice.toFixed(2)}</span></h5>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 