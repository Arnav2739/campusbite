const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const {
  protect,
  validateRegisterInput,
  validateLoginInput,
} = require('../middleware/authMiddleware');

// [Aditya] Authentication routes (/api/auth/*)
router.get('/test', (req, res) => res.json({ message: 'Auth route working!' }));

// POST /api/auth/register - Create a new user account (Public with validation)
router.post('/register', validateRegisterInput, registerUser);

// POST /api/auth/login - Authenticate & get token (Public with validation)
router.post('/login', validateLoginInput, loginUser);

// GET /api/auth/me - Get logged-in user profile (Protected)
router.get('/me', protect, getMe);

module.exports = router;


