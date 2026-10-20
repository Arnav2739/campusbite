/**
 * @file OrderTrackingPage.jsx
 * @description Live Student Order Tracking Page with 4-stage visual stepper, token display & order summary.
 * @author Vedanti (feat/vedanti-orders-tracking)
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  ChefHat,
  BellRing,
  ShoppingBag,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  PackageCheck,
  ChevronRight,
} from 'lucide-react';
import OrderTokenBadge from '../components/OrderTokenBadge';

// 4-Stage Visual Lifecycle Steps
const TRACKING_STAGES = [
  {
    key: 'Placed',
    title: 'Order Placed',
    desc: 'Order received & slot confirmed',
    icon: ShoppingBag,
    color: 'amber',
  },
  {
    key: 'Preparing',
    title: 'In Kitchen',
    desc: 'Canteen chefs are cooking your meal',
    icon: ChefHat,
    color: 'blue',
  },
  {
    key: 'Ready',
    title: 'Ready for Pickup',
    desc: 'Hot & packed at Express Counter 2',
    icon: BellRing,
    color: 'emerald',
  },
  {
    key: 'Completed',
    title: 'Picked Up',
    desc: 'Meal received — enjoy your bite!',
    icon: PackageCheck,
    color: 'gray',
  },
];

// Fallback demo order if user navigates directly without an active order
const DEMO_ORDER = {
  _id: 'cb_demo_order_101',
  pickupToken: 'CB-104',
  orderStatus: 'Preparing',
  slotLabel: '12:30 PM - 12:45 PM',
  studentName: 'Riya Sharma',
  rollNumber: 'CS2026-042',
  totalAmount: 185,
  subtotal: 165,
  taxAmount: 10,
  packagingFee: 10,
  paymentStatus: 'Completed',
  createdAt: new Date().toISOString(),
  items: [
    { name: 'Veg Schezwan Fried Rice', quantity: 1, price: 110, isVeg: true },
    { name: 'Cold Coffee with Ice Cream', quantity: 1, price: 55, isVeg: true },
  ],
};

const OrderTrackingPage = () => {
  const [currentOrder] = useState(DEMO_ORDER);

  // Determine stage progression index (0 to 3)
  const getStageIndex = (status) => {
    switch (status) {
      case 'Placed':
        return 0;
      case 'Preparing':
        return 1;
      case 'Ready':
        return 2;
      case 'Completed':
        return 3;
      case 'Cancelled':
        return -1;
      default:
        return 0;
    }
  };

  const currentStageIndex = getStageIndex(currentOrder?.orderStatus);
  const isCancelled = currentOrder?.orderStatus === 'Cancelled';

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Top Header & Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <Link
              to="/menu"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-orange-600 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Menu</span>
            </Link>
            <div className="flex items-center gap-1.5 text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Express Canteen Tracking</span>
            </div>
          </div>
          <h1 className="text-2xl font-black text-gray-900 mt-3">Live Order Tracking</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Real-time status updates from the canteen kitchen counter
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        {/* 4-Stage Visual Progress Stepper Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
            <div>
              <span className="text-xs font-bold text-orange-600 uppercase tracking-widest">
                Order Lifecycle
              </span>
              <h2 className="text-xl font-bold text-gray-900 mt-1">
                {isCancelled
                  ? 'Order Cancelled'
                  : currentOrder.orderStatus === 'Ready'
                  ? 'Ready for Counter Pickup!'
                  : currentOrder.orderStatus === 'Preparing'
                  ? 'Your Meal is Cooking in the Kitchen'
                  : currentOrder.orderStatus === 'Completed'
                  ? 'Order Completed'
                  : 'Order Placed & Queued'}
              </h2>
            </div>
            <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 px-3.5 py-1.5 rounded-2xl text-xs font-medium text-gray-700">
              <Clock className="w-4 h-4 text-orange-600" />
              <span>Pickup Slot: <strong>{currentOrder?.slotLabel}</strong></span>
            </div>
          </div>

          {/* Stepper Grid */}
          {!isCancelled ? (
            <div className="relative">
              {/* Connector Progress Bar Track */}
              <div className="hidden sm:block absolute top-7 left-12 right-12 h-1 bg-gray-100 z-0 rounded-full" />
              {/* Dynamic Fill Bar */}
              <div
                className="hidden sm:block absolute top-7 left-12 h-1 bg-gradient-to-r from-orange-500 to-amber-500 z-0 rounded-full transition-all duration-700"
                style={{
                  width: `${Math.min(100, (currentStageIndex / (TRACKING_STAGES.length - 1)) * 88)}%`,
                }}
              />

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 relative z-10">
                {TRACKING_STAGES.map((stage, idx) => {
                  const isPassed = currentStageIndex > idx;
                  const isCurrent = currentStageIndex === idx;
                  const StageIcon = stage.icon;

                  return (
                    <div
                      key={stage.key}
                      className={`flex sm:flex-col items-center sm:text-center gap-4 sm:gap-3 p-3 sm:p-0 rounded-2xl transition ${
                        isCurrent ? 'bg-orange-50/50 sm:bg-transparent' : ''
                      }`}
                    >
                      {/* Step Circle Node */}
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-sm ${
                          isCurrent
                            ? 'bg-gradient-to-br from-orange-500 to-amber-600 text-white ring-4 ring-orange-100 scale-110 shadow-orange-500/25'
                            : isPassed
                            ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                            : 'bg-white border-2 border-gray-200 text-gray-400'
                        }`}
                      >
                        {isPassed ? (
                          <CheckCircle2 className="w-6 h-6 text-white" />
                        ) : (
                          <StageIcon
                            className={`w-6 h-6 ${
                              isCurrent ? 'animate-bounce text-white' : 'text-gray-400'
                            }`}
                          />
                        )}
                      </div>

                      {/* Step Labels */}
                      <div className="text-left sm:text-center space-y-0.5">
                        <div className="flex items-center gap-1.5 sm:justify-center">
                          <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">
                            Step {idx + 1}
                          </span>
                        </div>
                        <h4
                          className={`text-sm font-bold ${
                            isCurrent
                              ? 'text-orange-900'
                              : isPassed
                              ? 'text-gray-900'
                              : 'text-gray-400'
                          }`}
                        >
                          {stage.title}
                        </h4>
                        <p className="text-[11px] text-gray-500 leading-tight">
                          {stage.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-6 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-800 text-xs">
              <AlertCircle className="w-6 h-6 text-red-600 shrink-0" />
              <div>
                <h4 className="font-bold">This order was cancelled</h4>
                <p className="text-red-700/80 mt-0.5">
                  The pickup counter slot has been released. If this was unexpected, please speak to kitchen staff.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom 2-Column: Token Badge & Item Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Digital Token Receipt Badge (5 cols) */}
          <div className="lg:col-span-5">
            <OrderTokenBadge
              token={currentOrder.pickupToken}
              status={currentOrder.orderStatus}
              slotLabel={currentOrder.slotLabel}
              studentName={currentOrder.studentName}
              rollNumber={currentOrder.rollNumber}
            />
          </div>

          {/* Right Column: Order Details & Tray Breakdown (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-gray-900">Tray Breakdown</h3>
                <p className="text-xs text-gray-500">Order ID: {currentOrder._id}</p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Paid via {currentOrder.paymentStatus}
              </span>
            </div>

            {/* Item List */}
            <div className="space-y-3">
              {currentOrder.items?.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-2xl bg-gray-50/70 border border-gray-100 text-xs"
                >
                  <div className="flex items-center space-x-2.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        item.isVeg !== false ? 'bg-emerald-500' : 'bg-red-500'
                      }`}
                    />
                    <span className="font-bold text-gray-800">{item.name}</span>
                    <span className="text-gray-400 font-semibold">×{item.quantity}</span>
                  </div>
                  <span className="font-bold text-gray-900">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Financial Summary */}
            <div className="border-t border-gray-100 pt-4 space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">₹{currentOrder.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>5% Canteen GST</span>
                <span className="font-semibold text-gray-900">₹{currentOrder.taxAmount}</span>
              </div>
              <div className="flex justify-between">
                <span>Tray & Packaging</span>
                <span className="font-semibold text-gray-900">₹{currentOrder.packagingFee}</span>
              </div>
              <div className="border-t border-dashed border-gray-200 pt-2 flex justify-between text-base font-black text-gray-900">
                <span>Total Paid</span>
                <span className="text-orange-600">₹{currentOrder.totalAmount}</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/menu"
                className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition"
              >
                <span>Order More Items</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;
