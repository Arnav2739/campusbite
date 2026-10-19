// [Arnav] CheckoutPage.jsx - Time slot picker & Mock UPI/Card payment
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Zap,
  Users,
  ChevronRight,
  CreditCard,
  RefreshCw,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import axiosInstance from '../api/axiosInstance';

// Fallback pickup slots matching backend seed data
const FALLBACK_SLOTS = [
  { _id: 'slot_1', slotLabel: '11:30 AM - 11:45 AM', maxCapacity: 25, bookedCount: 4, availableSpots: 21, isFull: false, urgencyStatus: 'available' },
  { _id: 'slot_2', slotLabel: '11:45 AM - 12:00 PM', maxCapacity: 25, bookedCount: 8, availableSpots: 17, isFull: false, urgencyStatus: 'available' },
  { _id: 'slot_3', slotLabel: '12:00 PM - 12:15 PM', maxCapacity: 25, bookedCount: 15, availableSpots: 10, isFull: false, urgencyStatus: 'available' },
  { _id: 'slot_4', slotLabel: '12:15 PM - 12:30 PM', maxCapacity: 30, bookedCount: 22, availableSpots: 8, isFull: false, urgencyStatus: 'available' },
  { _id: 'slot_5', slotLabel: '12:30 PM - 12:45 PM', maxCapacity: 30, bookedCount: 27, availableSpots: 3, isFull: false, urgencyStatus: 'filling-fast' },
  { _id: 'slot_6', slotLabel: '12:45 PM - 01:00 PM', maxCapacity: 25, bookedCount: 12, availableSpots: 13, isFull: false, urgencyStatus: 'available' },
  { _id: 'slot_7', slotLabel: '01:00 PM - 01:15 PM', maxCapacity: 25, bookedCount: 23, availableSpots: 2, isFull: false, urgencyStatus: 'filling-fast' },
  { _id: 'slot_8', slotLabel: '01:15 PM - 01:30 PM', maxCapacity: 20, bookedCount: 20, availableSpots: 0, isFull: true, urgencyStatus: 'full' },
];

const CheckoutPage = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    cartTotal,
    taxAmount,
    packagingFee,
    grandTotal,
    totalItemCount,
    selectedSlot,
    setSelectedSlot,
  } = useCart();

  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [slotError, setSlotError] = useState(null);

  // Fetch available slots from backend with resilient fallback
  useEffect(() => {
    const fetchSlots = async () => {
      setLoadingSlots(true);
      try {
        const res = await axiosInstance.get('/slots');
        if (Array.isArray(res.data) && res.data.length > 0) {
          setSlots(res.data);
          // If no slot is selected or previous selection is invalid, pick the first available one
          if (!selectedSlot) {
            const firstAvailable = res.data.find((s) => !s.isFull && s.availableSpots > 0);
            if (firstAvailable) setSelectedSlot(firstAvailable);
          }
        } else {
          setSlots(FALLBACK_SLOTS);
          if (!selectedSlot) setSelectedSlot(FALLBACK_SLOTS[0]);
        }
      } catch (err) {
        console.warn('Backend slots unavailable, using offline fallback:', err.message);
        setSlots(FALLBACK_SLOTS);
        if (!selectedSlot) setSelectedSlot(FALLBACK_SLOTS[0]);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, []);

  // Handle slot selection with validation
  const handleSelectSlot = (slot) => {
    if (slot.isFull || slot.availableSpots <= 0) {
      setSlotError('This slot is fully booked. Please select another 15-minute window.');
      return;
    }
    setSlotError(null);
    setSelectedSlot(slot);
  };

  // If cart is empty, render friendly empty prompt
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center border border-gray-100 shadow-xl">
          <div className="w-20 h-20 bg-orange-50 rounded-3xl flex items-center justify-center text-orange-500 mx-auto mb-4 border border-orange-100">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Your Tray is Empty</h2>
          <p className="text-xs text-gray-500 mt-2 leading-relaxed">
            Please select at least one item from the canteen menu before scheduling a pickup slot.
          </p>
          <Link
            to="/menu"
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/20 hover:from-orange-700 hover:to-amber-700 transition"
          >
            <span>Explore Canteen Menu</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Top Breadcrumb & Title */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <Link
              to="/menu"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-orange-600 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Menu</span>
            </Link>
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Campus Ordering</span>
            </div>
          </div>
          <h1 className="text-2xl font-black text-gray-900 mt-3">Schedule Pickup & Checkout</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Select a 15-minute counter pickup slot to avoid canteen queues during rush hours
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Time Slot Selection & Delivery Instructions (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Slot Picker Card */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2.5">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-gray-900">Select Pickup Time Slot</h2>
                    <p className="text-xs text-gray-500">15-minute managed canteen counter windows</p>
                  </div>
                </div>

                <div className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-lg font-medium hidden sm:block">
                  Today&apos;s Slots
                </div>
              </div>

              {slotError && (
                <div className="p-3 mb-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2 text-xs text-red-700 animate-shake">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{slotError}</span>
                </div>
              )}

              {loadingSlots ? (
                <div className="py-12 flex flex-col items-center justify-center text-gray-400">
                  <RefreshCw className="w-6 h-6 animate-spin text-orange-500 mb-2" />
                  <p className="text-xs">Checking live counter capacity...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {slots.map((slot) => {
                    const isSelected = selectedSlot?._id === slot._id;
                    const isFull = slot.isFull || slot.availableSpots <= 0;
                    const isFillingFast = slot.urgencyStatus === 'filling-fast' || (slot.availableSpots <= 5 && !isFull);

                    return (
                      <div
                        key={slot._id}
                        onClick={() => handleSelectSlot(slot)}
                        className={`relative p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'border-orange-500 bg-orange-50/60 ring-2 ring-orange-500 shadow-md shadow-orange-500/10'
                            : isFull
                            ? 'border-gray-200 bg-gray-100/70 opacity-60 cursor-not-allowed'
                            : 'border-gray-200 bg-white hover:border-orange-300 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-2">
                            <Clock
                              className={`w-4 h-4 ${
                                isSelected ? 'text-orange-600' : isFull ? 'text-gray-400' : 'text-gray-600'
                              }`}
                            />
                            <span
                              className={`text-xs font-bold ${
                                isSelected ? 'text-orange-900' : isFull ? 'text-gray-400' : 'text-gray-800'
                              }`}
                            >
                              {slot.slotLabel}
                            </span>
                          </div>

                          {isSelected && (
                            <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0" />
                          )}
                        </div>

                        {/* Capacity Metric Pill */}
                        <div className="mt-3 flex items-center justify-between text-xs">
                          {isFull ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 bg-red-100/80 px-2 py-0.5 rounded-md">
                              Slot Full
                            </span>
                          ) : isFillingFast ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-md">
                              <Zap className="w-3 h-3 text-amber-600" />
                              <span>{slot.availableSpots} spots left!</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                              <Users className="w-3 h-3 text-emerald-500" />
                              <span>{slot.availableSpots} spots open</span>
                            </span>
                          )}

                          <span className="text-[11px] text-gray-400 font-medium">
                            Cap: {slot.maxCapacity || 25}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Student Instructions Banner */}
            <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-200/80 rounded-3xl p-5 flex items-start space-x-3.5">
              <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 space-y-1">
                <p className="font-bold">How Express Counter Pickup Works:</p>
                <p className="text-amber-800/90 leading-relaxed">
                  Upon payment confirmation, a unique <strong>4-digit Pickup Token (e.g. CB-104)</strong> will be generated. Simply show your token badge at the counter during your reserved time slot to receive your hot, freshly packed meal!
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Payment Button (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <h2 className="text-base font-bold text-gray-900">Tray Summary</h2>
                <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full">
                  {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'}
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          item.isVeg ? 'bg-emerald-500' : 'bg-red-500'
                        }`}
                      />
                      <span className="text-gray-800 font-medium truncate">{item.name}</span>
                      <span className="text-gray-400 font-semibold">×{item.quantity || 1}</span>
                    </div>
                    <span className="font-bold text-gray-900 ml-2">
                      ₹{item.price * (item.quantity || 1)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Selected Slot Confirmation Badge */}
              <div className="p-3 bg-orange-50/80 border border-orange-200 rounded-2xl flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 text-orange-900">
                  <Clock className="w-4 h-4 text-orange-600 shrink-0" />
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-orange-600 tracking-wider">
                      Reserved Pickup Window
                    </span>
                    <span className="font-bold text-gray-900">
                      {selectedSlot ? selectedSlot.slotLabel : 'Select a slot on the left'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Price Math */}
              <div className="border-t border-gray-100 pt-4 space-y-2 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">₹{cartTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>5% Canteen GST</span>
                  <span className="font-semibold text-gray-900">₹{taxAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tray & Eco-Packaging</span>
                  <span className="font-semibold text-gray-900">₹{packagingFee}</span>
                </div>
                <div className="border-t border-dashed border-gray-200 pt-2 flex justify-between text-base font-black text-gray-900">
                  <span>Total Amount</span>
                  <span className="text-orange-600">₹{grandTotal}</span>
                </div>
              </div>

              {/* Proceed to Payment Action Button */}
              <button
                disabled={!selectedSlot || selectedSlot.isFull}
                className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                  !selectedSlot || selectedSlot.isFull
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                    : 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white shadow-orange-500/25'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Select Payment Method (₹{grandTotal})</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

