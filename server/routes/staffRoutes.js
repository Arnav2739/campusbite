/**
 * @file staffRoutes.js
 * @description Express routing definitions for all CampusBite Kitchen Staff APIs.
 *              Mounted at `/api/staff` in the central Express app.
 *              Enforces two-layer middleware security on all sub-routes:
 *                1. `protect`   — validates JWT token from Authorization header
 *                2. `staffOnly` — verifies user.role === 'staff'
 * @author Anish (feat/anish-staff-dashboard)
 * @module routes/staffRoutes
 */

const express = require('express');
const router = express.Router();
const { protect, staffOnly } = require('../middleware/authMiddleware');
const {
  getKitchenQueue,
  updateOrderStatus,
  toggleMenuItemStock,
  getMenuItems,
  getStaffAnalytics,
} = require('../controllers/staffController');

// All staff routes are strictly protected — must be authenticated with role='staff'
router.use(protect, staffOnly);

/**
 * @route   GET /api/staff/kitchen-queue
 * @desc    Fetch active orders in kitchen queue (Placed, Preparing, Ready)
 * @access  Private / Staff Only
 */
router.get('/kitchen-queue', getKitchenQueue);

/**
 * @route   GET /api/staff/menu
 * @desc    Retrieve all menu items grouped for staff stock management
 * @access  Private / Staff Only
 */
router.get('/menu', getMenuItems);

/**
 * @route   PATCH /api/staff/orders/:id/status
 * @desc    Update order lifecycle status (Placed -> Preparing -> Ready -> Completed / Cancelled)
 * @access  Private / Staff Only
 */
router.patch('/orders/:id/status', updateOrderStatus);

/**
 * @route   PATCH /api/staff/menu/:id/toggle
 * @desc    Toggle menu item availability flag (isAvailable) in real-time
 * @access  Private / Staff Only
 */
router.patch('/menu/:id/toggle', toggleMenuItemStock);

/**
 * @route   GET /api/staff/analytics
 * @desc    Get kitchen sales analytics (today's revenue, completed count, top sellers)
 * @access  Private / Staff Only
 */
router.get('/analytics', getStaffAnalytics);

module.exports = router;
