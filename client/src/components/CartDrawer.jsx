// [Arnav] CartDrawer.jsx - Slide-out cart summary & quantity controls
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Clock,
  Sparkles,
  UtensilsCrossed,
} from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartDrawer = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalItemCount,
    cartTotal,
    taxAmount,
    packagingFee,
    grandTotal,
    selectedSlot,
  } = useCart();

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

  const handleProceedToCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  const handleBrowseMenu = () => {
    closeCart();
    navigate('/menu');
  };

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

            <div className="flex items-center space-x-2">
              {cartItems.length > 0 && (
                <button
                  onClick={clearCart}
                  title="Clear Cart"
                  className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition text-xs font-semibold flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Clear</span>
                </button>
              )}

              <button
                onClick={closeCart}
                className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 active:scale-95 transition"
                aria-label="Close cart drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Drawer Body Area */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {cartItems.length === 0 ? (
              // Empty Cart State
              <div className="h-full flex flex-col items-center justify-center text-center px-4 py-12">
                <div className="w-20 h-20 rounded-3xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-500 mb-4 shadow-sm">
                  <UtensilsCrossed className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Your tray is empty</h3>
                <p className="text-xs text-gray-500 mt-1.5 max-w-xs leading-relaxed">
                  You haven&apos;t added any items yet. Explore the menu to order freshly prepared canteen snacks and meals!
                </p>
                <button
                  onClick={handleBrowseMenu}
                  className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold rounded-xl shadow-md shadow-orange-500/20 hover:from-orange-600 hover:to-amber-600 transition active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Browse Canteen Menu</span>
                </button>
              </div>
            ) : (
              // Populated Cart Item List
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="p-3.5 bg-gray-50/70 border border-gray-200/80 rounded-2xl flex items-center justify-between gap-3 hover:border-orange-200 transition"
                  >
                    {/* Item Thumbnail & Info */}
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-200 shrink-0">
                        <img
                          src={
                            item.imageUrl ||
                            'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60'
                          }
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        <span
                          className={`absolute top-1 left-1 w-2.5 h-2.5 rounded-full border border-white shadow-xs ${
                            item.isVeg ? 'bg-emerald-500' : 'bg-red-500'
                          }`}
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-bold text-gray-900 truncate">
                          {item.name}
                        </h4>
                        <div className="flex items-center space-x-2 mt-0.5 text-xs text-gray-500">
                          <span>₹{item.price} each</span>
                          {item.prepTime && (
                            <span className="flex items-center gap-0.5 text-amber-600">
                              <Clock className="w-3 h-3" />
                              {item.prepTime}m
                            </span>
                          )}
                        </div>
                        <div className="text-xs font-extrabold text-orange-600 mt-0.5">
                          ₹{item.price * (item.quantity || 1)}
                        </div>
                      </div>
                    </div>

                    {/* Stepper Controls */}
                    <div className="flex items-center space-x-1.5 bg-white border border-gray-200 rounded-xl p-1 shadow-xs shrink-0">
                      <button
                        onClick={() => updateQuantity(item._id, -1)}
                        className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-bold text-gray-800 w-5 text-center">
                        {item.quantity || 1}
                      </span>
                      <button
                        onClick={() => updateQuantity(item._id, 1)}
                        className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition ml-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Pickup Slot Selection Notice */}
                <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl flex items-center space-x-2.5 text-xs text-amber-800 mt-2">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                  <div>
                    {selectedSlot ? (
                      <span>
                        Pickup Slot: <strong className="font-bold">{selectedSlot.slotLabel}</strong>
                      </span>
                    ) : (
                      <span>
                        Choose a 15-minute pickup time slot during checkout to skip the queue!
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Drawer Footer Bill Breakdown & Checkout Action */}
          {cartItems.length > 0 && (
            <div className="border-t border-gray-200 p-5 bg-gray-50/90 space-y-3 shrink-0">
              {/* Itemized Math */}
              <div className="space-y-1.5 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">₹{cartTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Canteen Tax (5% GST)</span>
                  <span className="font-semibold text-gray-900">₹{taxAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tray & Packaging</span>
                  <span className="font-semibold text-gray-900">₹{packagingFee}</span>
                </div>
                <div className="border-t border-dashed border-gray-200 pt-1.5 flex justify-between text-sm font-black text-gray-900">
                  <span>Grand Total</span>
                  <span className="text-base text-orange-600">₹{grandTotal}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-orange-500/25 flex items-center justify-between transition-all active:scale-[0.98]"
              >
                <div className="text-left">
                  <span className="block text-xs font-normal text-orange-100">Proceed with Tray</span>
                  <span>Pay ₹{grandTotal}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/20">
                  <span>Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;


