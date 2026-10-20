/**
 * @file Order.js
 * @description Mongoose model for Student Canteen Orders with token, itemized items & status lifecycle.
 * @author Vedanti (feat/vedanti-orders-tracking)
 */

const mongoose = require('mongoose');

// Itemized ordered menu item subdocument
const orderItemSchema = new mongoose.Schema(
  {
    menuItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuItem',
      required: [true, 'Menu item ID reference is required'],
    },
    name: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
      default: 1,
    },
    price: {
      type: Number,
      required: [true, 'Price per unit is required'],
      min: [0, 'Price cannot be negative'],
    },
    isVeg: {
      type: Boolean,
      default: true,
    },
    imageUrl: {
      type: String,
      default: '',
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student ID reference is required'],
      index: true,
    },
    // Cached student metadata for resilient kitchen queue display
    studentName: {
      type: String,
      trim: true,
      default: 'Student',
    },
    rollNumber: {
      type: String,
      trim: true,
      default: 'N/A',
    },
    items: {
      type: [orderItemSchema],
      validate: {
        validator: function (items) {
          return Array.isArray(items) && items.length > 0;
        },
        message: 'An order must contain at least one item',
      },
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: [0, 'Total amount cannot be negative'],
    },
    subtotal: {
      type: Number,
      min: 0,
    },
    taxAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    packagingFee: {
      type: Number,
      default: 10,
      min: 0,
    },
    timeSlotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TimeSlot',
      index: true,
    },
    // Cached human-readable slot label (e.g., "12:30 PM - 12:45 PM")
    slotLabel: {
      type: String,
      trim: true,
      default: 'Express Pickup',
    },
    // Unique daily pickup counter token (e.g., CB-104)
    pickupToken: {
      type: String,
      required: [true, 'Pickup token is required'],
      uppercase: true,
      trim: true,
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: ['upi', 'wallet', 'card', 'cash'],
      default: 'upi',
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
      default: 'Completed',
      index: true,
    },
    orderStatus: {
      type: String,
      enum: ['Placed', 'Preparing', 'Ready', 'Completed', 'Cancelled'],
      default: 'Placed',
      index: true,
    },
    specialInstructions: {
      type: String,
      trim: true,
      maxlength: [250, 'Instructions cannot exceed 250 characters'],
      default: '',
    },
    // Lifecycle timestamp tracker
    statusTimestamps: {
      placedAt: { type: Date, default: Date.now },
      preparingAt: { type: Date },
      readyAt: { type: Date },
      completedAt: { type: Date },
      cancelledAt: { type: Date },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: Total item count across all quantities in this order
orderSchema.virtual('totalItemCount').get(function () {
  if (!this.items) return 0;
  return this.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
});

// Virtual: Check if order is currently active (in progress)
orderSchema.virtual('isActive').get(function () {
  return ['Placed', 'Preparing', 'Ready'].includes(this.orderStatus);
});

// Compound indexes for optimal query performance
orderSchema.index({ studentId: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1, createdAt: 1 });
orderSchema.index({ timeSlotId: 1, orderStatus: 1 });

module.exports = mongoose.model('Order', orderSchema);
