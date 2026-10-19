// [Anish] staffRoutes.js
// Mounts at: /api/staff  (pre-wired in server.js — DO NOT touch server.js)
// Branch: feat/anish-staff-dashboard

const express = require('express');
const router = express.Router();
const { protect, staffOnly } = require('../middleware/authMiddleware');
const {
  getKitchenQueue,
  updateOrderStatus,
  toggleMenuItemStock,
  getStaffAnalytics,
} = require('../controllers/staffController');

// All staff routes are protected — must be logged in AND have role=staff
router.use(protect, staffOnly);

// GET  /api/staff/kitchen-queue     → live kitchen order queue
router.get('/kitchen-queue', getKitchenQueue);

// PATCH /api/staff/orders/:id/status → update a single order's status
router.patch('/orders/:id/status', updateOrderStatus);

// PATCH /api/staff/menu/:id/toggle  → flip isAvailable on a menu item
router.patch('/menu/:id/toggle', toggleMenuItemStock);

// GET  /api/staff/analytics          → today's revenue & top sellers
router.get('/analytics', getStaffAnalytics);

module.exports = router;
