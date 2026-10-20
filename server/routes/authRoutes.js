/**
 * @file authRoutes.js
 * @description Express routing definition for CampusBite authentication endpoints (/api/auth/*).
 * Pre-wired with security headers, payload validation, and JWT route guards.
 * @author Aditya (feat/aditya-auth-security)
 */

const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  getMe,
} = require('../controllers/authController');

const {
  protect,
  securityHeaders,
  validateRegisterInput,
  validateLoginInput,
} = require('../middleware/authMiddleware');

// Apply security headers (no-cache, nosniff, frame-guard) to all auth endpoints
router.use(securityHeaders);

/**
 * Health check & diagnostic endpoint
 * @route GET /api/auth/test
 * @access Public
 */
router.get('/test', (req, res) => res.json({ message: 'Auth route working!' }));

/**
 * User registration endpoint
 * @route POST /api/auth/register
 * @access Public
 */
router.post('/register', validateRegisterInput, registerUser);

/**
 * User login endpoint
 * @route POST /api/auth/login
 * @access Public
 */
router.post('/login', validateLoginInput, loginUser);

/**
 * Authenticated user profile retrieval
 * @route GET /api/auth/me
 * @access Private (JWT required)
 */
router.get('/me', protect, getMe);

module.exports = router;



