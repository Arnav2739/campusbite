// [Aditya] authMiddleware.js
// Protect routes (JWT verification) and role guard (staffOnly)
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @desc    Verify JWT token and attach user to request
// @usage   router.get('/protected-route', protect, handler)
const protect = async (req, res, next) => {
  let token;

  // --- Extract token from Authorization header ---
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // No token found
  if (!token) {
    return res.status(401).json({
      message: 'Not authorized — no token provided',
    });
  }

  try {
    // --- Verify token signature & expiry ---
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // --- Fetch user from DB (exclude passwordHash for security) ---
    const user = await User.findById(decoded.id).select('-passwordHash');

    if (!user) {
      return res.status(401).json({
        message: 'Not authorized — user no longer exists',
      });
    }

    // --- Attach user to request object for downstream handlers ---
    req.user = user;
    next();
  } catch (error) {
    // Token expired or tampered
    const message =
      error.name === 'TokenExpiredError'
        ? 'Not authorized — token has expired'
        : 'Not authorized — invalid token';

    return res.status(401).json({ message });
  }
};

// @desc    Restrict access to staff-only routes
// @usage   router.patch('/admin-action', protect, staffOnly, handler)
// @note    Must be used AFTER protect middleware (needs req.user)
const staffOnly = (req, res, next) => {
  if (req.user && req.user.role === 'staff') {
    next();
  } else {
    return res.status(403).json({
      message: 'Forbidden — staff access only',
    });
  }
};

// @desc    Validate request body for user registration
const validateRegisterInput = (req, res, next) => {
  const { name, email, password, role } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  }

  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!email || !emailRegex.test(email.trim())) {
    errors.push('A valid email address is required');
  }

  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  if (role && !['student', 'staff'].includes(role)) {
    errors.push("Role must be either 'student' or 'staff'");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      message: 'Validation failed',
      errors,
    });
  }

  next();
};

// @desc    Validate request body for login
const validateLoginInput = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || !email.trim()) {
    errors.push('Email is required');
  }

  if (!password) {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      message: 'Validation failed',
      errors,
    });
  }

  next();
};

module.exports = {
  protect,
  staffOnly,
  validateRegisterInput,
  validateLoginInput,
};


