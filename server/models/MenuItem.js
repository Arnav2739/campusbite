// [Pushkar] MenuItem.js - Food catalog schema
const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Snacks', 'Meals', 'Beverages'],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    isVeg: {
      type: Boolean,
      default: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    imageUrl: {
      type: String,
      default: '',
    },
    prepTime: {
      type: Number, // in minutes
      default: 10,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MenuItem', menuItemSchema);
