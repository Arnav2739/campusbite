// [Arnav] TimeSlot.js - Pickup slot & capacity schema
const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema(
  {
    slotLabel: {
      type: String,
      required: true,
      trim: true,
    },
    maxCapacity: {
      type: Number,
      default: 25,
    },
    bookedCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TimeSlot', timeSlotSchema);
