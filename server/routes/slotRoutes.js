const express = require('express');
const router = express.Router();
const {
  getSlots,
  getSlotById,
  reserveSlot,
} = require('../controllers/slotController');

// [Arnav] Time slot & capacity routes (/api/slots/*)

// @route   GET /api/slots
// @desc    Get all active pickup time slots with remaining capacities
// @access  Public / Logged In
router.get('/', getSlots);

// @route   GET /api/slots/test
// @desc    Slot module health check test route
// @access  Public
router.get('/test', (req, res) => res.json({ message: 'Slot route working!' }));

// @route   GET /api/slots/:id
// @desc    Get specific slot details with available spots
// @access  Public / Logged In
router.get('/:id', getSlotById);

// @route   POST /api/slots/:id/reserve
// @desc    Atomically reserve a spot in the given slot
// @access  Internal / Logged In
router.post('/:id/reserve', reserveSlot);

module.exports = router;

