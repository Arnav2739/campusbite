/**
 * @file orderRoutes.js
 * @description Express routing for Student Canteen Orders, Tracking & Pickup Tokens.
 * @author Vedanti (feat/vedanti-orders-tracking)
 */

const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

// Health check / verification endpoint
router.get('/test', (req, res) => {
  res.json({
    status: 'online',
    module: 'Orders & Tracking Engine',
    assignedTo: 'Vedanti',
    timestamp: new Date().toISOString(),
  });
});

// Student Order Endpoints (Protected by JWT)
router.post('/', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', getOrderById); // Accessible for live tracking page polling by ID or Token
router.patch('/:id/cancel', protect, cancelOrder);

module.exports = router;
