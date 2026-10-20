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

module.exports = { protect, staffOnly };

