/**
 * @file authMiddleware.js
 * @description Authentication, authorization, and input validation middleware for CampusBite.
 * @author Aditya (feat/aditya-auth-security)
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware: Verifies the incoming Bearer JWT token from Authorization header.
 * Attaches the authenticated user document to req.user (excluding passwordHash).
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
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

/**
 * Middleware: Restricts route access strictly to users having the 'staff' role.
 * MUST be chained AFTER the `protect` middleware.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const staffOnly = (req, res, next) => {
  if (req.user && req.user.role === 'staff') {
    next();
  } else {
    return res.status(403).json({
      message: 'Forbidden — staff access only',
    });
  }
};

/**
 * Middleware: Injects HTTP security headers on sensitive authentication endpoints.
 * Prevents MIME sniffing, clickjacking, and browser caching of credentials.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const securityHeaders = (req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
};

/**
 * Middleware: Validates the payload required to register a user.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
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

/**
 * Middleware: Validates the payload required to log in.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
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
  securityHeaders,
  validateRegisterInput,
  validateLoginInput,
};



