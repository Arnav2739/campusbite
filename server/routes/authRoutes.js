const express = require('express');
const router = express.Router();
const { registerUser } = require('../controllers/authController');

// [Aditya] Authentication routes (/api/auth/*)
router.get('/test', (req, res) => res.json({ message: 'Auth route working!' }));

// POST /api/auth/register - Create a new user account
router.post('/register', registerUser);

module.exports = router;

