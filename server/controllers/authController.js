// [Aditya] authController.js - Register, login, profile logic
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper: Generate JWT token with user id & role
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// @desc    Register a new student or staff user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, rollNumber, phone, role } = req.body;

    // --- Validate required fields ---
    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Please provide name, email, and password');
    }

    if (password.length < 6) {
      res.status(400);
      throw new Error('Password must be at least 6 characters');
    }

    // --- Check if user already exists ---
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(409);
      throw new Error('An account with this email already exists');
    }

    // --- Create new user (password hashed via pre-save hook) ---
    const user = await User.create({
      name,
      email,
      passwordHash: password,     // pre-save hook will bcrypt hash this
      rollNumber: rollNumber || null,
      phone: phone || null,
      role: role || 'student',
    });

    // --- Generate token & respond ---
    const token = generateToken(user);

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        rollNumber: user.rollNumber,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({ message: error.message });
  }
};

// @desc    Authenticate user & return JWT token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // --- Validate required fields ---
    if (!email || !password) {
      res.status(400);
      throw new Error('Please provide email and password');
    }

    // --- Find user by email ---
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    // --- Compare entered password with stored hash ---
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    // --- Generate token & respond ---
    const token = generateToken(user);

    res.status(200).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        rollNumber: user.rollNumber,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({ message: error.message });
  }
};

// @desc    Get current logged-in user's profile
// @route   GET /api/auth/me
// @access  Private (requires protect middleware)
const getMe = async (req, res) => {
  try {
    // req.user is already attached by protect middleware (without passwordHash)
    const user = req.user;

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      rollNumber: user.rollNumber,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar,
      createdAt: user.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};

