// [Arnav] CartContext.jsx - Placeholder
import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (item) => {
    // Arnav will implement full cart logic
    setCartItems((prev) => [...prev, item]);
  };

  const updateQuantity = (id, delta) => {};

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
export default CartContext;
