// [Arnav] CartDrawer.jsx - Slide-out cart summary & quantity controls
import React, { useEffect } from 'react';
import { X, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartDrawer = () => {
  const { isCartOpen, closeCart, totalItemCount } = useCart();

  // Close drawer on Escape key press & prevent background scrolling
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isCartOpen) {
        closeCart();
      }
    };

    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCartOpen, closeCart]);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dimmed Backdrop Overlay with Blur */}
      <div
        onClick={closeCart}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full transform transition ease-in-out duration-300">
          {/* Header */}
          <div className="px-5 py-4 bg-gradient-to-r from-orange-600 to-amber-600 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <ShoppingBag className="w-5 h-5 text-amber-200" />
              </div>
              <div>
                <h2 className="text-base font-extrabold tracking-tight">Your Canteen Tray</h2>
                <p className="text-xs text-orange-100 font-medium">
                  {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'} selected
                </p>
              </div>
            </div>

            <button
              onClick={closeCart}
              className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 active:scale-95 transition"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body Area Scaffolding */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            <div className="text-center py-8 text-gray-500 text-sm">
              Loading cart contents...
            </div>
          </div>

          {/* Drawer Footer Scaffolding */}
          <div className="border-t border-gray-100 p-5 bg-gray-50/80">
            <div className="flex justify-between items-center text-sm font-semibold text-gray-700">
              <span>Subtotal</span>
              <span>₹0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;

