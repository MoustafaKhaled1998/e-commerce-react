import { createContext, useContext, useState, useMemo } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({});

  const total = useMemo(() => {
    return Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const addToCart = (productId, product) => {
    setCart(prev => {
      const existing = prev[productId];
      return {
        ...prev,
        [productId]: existing 
          ? { ...existing, quantity: existing.quantity + 1 }
          : { product, quantity: 1 }
      };
    });
  };

  const updateQuantity = (productId, quantity) => {
    setCart(prev => {
      if (quantity <= 0) {
        const { [productId]: removed, ...rest } = prev;
        return rest;
      }
      return {
        ...prev,
        [productId]: { ...prev[productId], quantity }
      };
    });
  };

  return (
    <CartContext.Provider value={{ cart, total, addToCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
}; 