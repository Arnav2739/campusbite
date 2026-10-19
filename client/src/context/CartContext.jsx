// [Arnav] CartContext.jsx - Cart items, quantity math, localStorage & slot state
import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

const CART_STORAGE_KEY = 'campusbite_cart';
const SLOT_STORAGE_KEY = 'campusbite_selected_slot';

export const CartProvider = ({ children }) => {
  // 1. Cart Items with localStorage hydration
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.warn('Failed to parse cart from localStorage:', e);
      return [];
    }
  });

  // 2. Selected Pickup TimeSlot with localStorage hydration
  const [selectedSlot, setSelectedSlot] = useState(() => {
    try {
      const saved = localStorage.getItem(SLOT_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.warn('Failed to parse slot from localStorage:', e);
      return null;
    }
  });

  // 3. Cart Drawer visibility state
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Sync cart items to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.warn('Failed to save cart to localStorage:', e);
    }
  }, [cartItems]);

  // Sync selected slot to localStorage
  useEffect(() => {
    try {
      if (selectedSlot) {
        localStorage.setItem(SLOT_STORAGE_KEY, JSON.stringify(selectedSlot));
      } else {
        localStorage.removeItem(SLOT_STORAGE_KEY);
      }
    } catch (e) {
      console.warn('Failed to save slot to localStorage:', e);
    }
  }, [selectedSlot]);

  // Drawer controls
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  // Add item to cart and open drawer for feedback
  const addToCart = (item) => {
    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((i) => i._id === item._id);
      if (existingIndex > -1) {
        return prevItems.map((i, index) =>
          index === existingIndex ? { ...i, quantity: (i.quantity || 1) + 1 } : i
        );
      }
      return [...prevItems, { ...item, quantity: 1 }];
    });
    // Auto-open drawer to show student the added item
    setIsCartOpen(true);
  };

  // Update quantity with delta (+1 or -1); automatically remove when quantity reaches 0
  const updateQuantity = (id, delta) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) => {
          if (item._id === id) {
            const newQty = (item.quantity || 1) + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  // Remove specific item completely from cart
  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item._id !== id));
  };

  // Clear all items and reset selected slot
  const clearCart = () => {
    setCartItems([]);
    setSelectedSlot(null);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
      localStorage.removeItem(SLOT_STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clear cart storage:', e);
    }
  };

  // Financial calculations & metrics
  const totalItemCount = cartItems.reduce(
    (total, item) => total + (item.quantity || 1),
    0
  );

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * (item.quantity || 1),
    0
  );

  // 5% standard canteen GST and nominal packaging fee
  const taxAmount = Math.round(cartTotal * 0.05);
  const packagingFee = cartTotal > 0 ? 5 : 0;
  const grandTotal = cartTotal + taxAmount + packagingFee;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
        selectedSlot,
        setSelectedSlot,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItemCount,
        cartTotal,
        taxAmount,
        packagingFee,
        grandTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;


