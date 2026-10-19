// [Arnav] slotController.js - Slot listing & capacity checks
const mongoose = require('mongoose');
const TimeSlot = require('../models/TimeSlot');

// Default fallback slots in case database has not yet been seeded
const DEFAULT_FALLBACK_SLOTS = [
  { _id: 'slot_1', slotLabel: '11:30 AM - 11:45 AM', maxCapacity: 25, bookedCount: 4, isActive: true },
  { _id: 'slot_2', slotLabel: '11:45 AM - 12:00 PM', maxCapacity: 25, bookedCount: 8, isActive: true },
  { _id: 'slot_3', slotLabel: '12:00 PM - 12:15 PM', maxCapacity: 25, bookedCount: 15, isActive: true },
  { _id: 'slot_4', slotLabel: '12:15 PM - 12:30 PM', maxCapacity: 30, bookedCount: 22, isActive: true },
  { _id: 'slot_5', slotLabel: '12:30 PM - 12:45 PM', maxCapacity: 30, bookedCount: 18, isActive: true },
  { _id: 'slot_6', slotLabel: '12:45 PM - 01:00 PM', maxCapacity: 25, bookedCount: 12, isActive: true },
  { _id: 'slot_7', slotLabel: '01:00 PM - 01:15 PM', maxCapacity: 25, bookedCount: 6, isActive: true },
  { _id: 'slot_8', slotLabel: '01:15 PM - 01:30 PM', maxCapacity: 20, bookedCount: 20, isActive: true },
];

/**
 * Computes availability status and remaining spots for a slot
 * @param {Object} slot
 * @returns {Object} Enriched slot object
 */
const formatSlotWithCapacity = (slot) => {
  const maxCapacity = slot.maxCapacity || 25;
  const bookedCount = slot.bookedCount || 0;
  const availableSpots = Math.max(0, maxCapacity - bookedCount);
  const isFull = availableSpots === 0;

  let urgencyStatus = 'available';
  if (isFull) {
    urgencyStatus = 'full';
  } else if (availableSpots <= 5) {
    urgencyStatus = 'filling-fast';
  }

  return {
    _id: slot._id,
    slotLabel: slot.slotLabel,
    maxCapacity,
    bookedCount,
    availableSpots,
    isFull,
    urgencyStatus,
    isActive: slot.isActive !== false,
    createdAt: slot.createdAt,
  };
};

// @desc    Get all active pickup time slots with computed remaining capacity
// @route   GET /api/slots
// @access  Public / Logged In
const getSlots = async (req, res) => {
  try {
    const { includeInactive } = req.query;
    const query = includeInactive === 'true' ? {} : { isActive: true };

    const slots = await TimeSlot.find(query).sort({ slotLabel: 1, createdAt: 1 });

    if (!slots || slots.length === 0) {
      // Return formatted fallback slots if DB is unseeded
      const fallbackFormatted = DEFAULT_FALLBACK_SLOTS.map(formatSlotWithCapacity);
      return res.json(fallbackFormatted);
    }

    const formattedSlots = slots.map((slot) => formatSlotWithCapacity(slot.toObject()));
    res.json(formattedSlots);
  } catch (error) {
    // If MongoDB error or disconnected, return fallback slots for uninterrupted student experience
    console.warn('Error fetching slots from DB, serving fallback:', error.message);
    const fallbackFormatted = DEFAULT_FALLBACK_SLOTS.map(formatSlotWithCapacity);
    res.json(fallbackFormatted);
  }
};

// @desc    Get single time slot by ID with availability check
// @route   GET /api/slots/:id
// @access  Public / Logged In
const getSlotById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      // Check fallback
      const fallback = DEFAULT_FALLBACK_SLOTS.find((s) => s._id === id);
      if (fallback) {
        return res.json(formatSlotWithCapacity(fallback));
      }
      return res.status(400).json({ message: 'Invalid time slot ID format' });
    }

    const slot = await TimeSlot.findById(id);
    if (!slot) {
      return res.status(404).json({ message: 'Time slot not found' });
    }

    res.json(formatSlotWithCapacity(slot.toObject()));
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving time slot', error: error.message });
  }
};

// @desc    Atomically reserve a spot in a time slot
// @route   POST /api/slots/:id/reserve
// @access  Internal / Logged In
const reserveSlot = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid time slot ID' });
    }

    const updatedSlot = await TimeSlot.reserveSlot(id);
    res.json({
      message: 'Time slot spot reserved successfully',
      slot: formatSlotWithCapacity(updatedSlot.toObject()),
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Helper function for teammate modules (e.g. Vedanti's orderController)
const reserveSlotInternal = async (slotId) => {
  return await TimeSlot.reserveSlot(slotId);
};

// Helper function to release slot on order cancellation
const releaseSlotInternal = async (slotId) => {
  return await TimeSlot.releaseSlot(slotId);
};

module.exports = {
  getSlots,
  getSlotById,
  reserveSlot,
  reserveSlotInternal,
  releaseSlotInternal,
  formatSlotWithCapacity,
};

