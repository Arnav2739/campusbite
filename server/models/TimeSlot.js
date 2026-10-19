// [Arnav] TimeSlot.js - Pickup slot & capacity schema
const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema(
  {
    slotLabel: {
      type: String,
      required: [true, 'Slot label is required (e.g. 12:30 PM - 12:45 PM)'],
      trim: true,
    },
    maxCapacity: {
      type: Number,
      required: true,
      default: 25,
      min: [1, 'Maximum capacity must be at least 1'],
    },
    bookedCount: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Booked count cannot be negative'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for available remaining spots
timeSlotSchema.virtual('availableSpots').get(function () {
  return Math.max(0, this.maxCapacity - this.bookedCount);
});

// Virtual for full capacity flag
timeSlotSchema.virtual('isFull').get(function () {
  return this.bookedCount >= this.maxCapacity;
});

/**
 * Atomically reserve a spot in the given time slot
 * Prevents overbooking by checking bookedCount < maxCapacity in the query condition
 * @param {string|mongoose.Types.ObjectId} slotId
 * @returns {Promise<Document>} Updated slot document
 */
timeSlotSchema.statics.reserveSlot = async function (slotId) {
  const slot = await this.findOneAndUpdate(
    {
      _id: slotId,
      isActive: true,
      $expr: { $lt: ['$bookedCount', '$maxCapacity'] },
    },
    { $inc: { bookedCount: 1 } },
    { new: true }
  );

  if (!slot) {
    const existing = await this.findById(slotId);
    if (!existing) {
      throw new Error('Time slot not found');
    }
    if (!existing.isActive) {
      throw new Error('This time slot is no longer active');
    }
    throw new Error('This time slot is completely full. Please choose another pickup time.');
  }

  return slot;
};

/**
 * Atomically release a reserved spot in the given time slot (e.g. upon order cancellation)
 * @param {string|mongoose.Types.ObjectId} slotId
 * @returns {Promise<Document>} Updated slot document
 */
timeSlotSchema.statics.releaseSlot = async function (slotId) {
  return await this.findOneAndUpdate(
    {
      _id: slotId,
      bookedCount: { $gt: 0 },
    },
    { $inc: { bookedCount: -1 } },
    { new: true }
  );
};

module.exports = mongoose.model('TimeSlot', timeSlotSchema);

