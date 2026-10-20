/**
 * @file User.js
 * @description Mongoose model definition for CampusBite users (students & staff).
 * Handles schema validation, password hashing using bcrypt, virtual avatars, and password comparison.
 * @author Aditya (feat/aditya-auth-security)
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * Mongoose Schema for CampusBite User entities.
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    rollNumber: {
      type: String,
      trim: true,
      default: null,
    },
    phone: {
      type: String,
      trim: true,
      default: null,
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    role: {
      type: String,
      enum: {
        values: ['student', 'staff'],
        message: 'Role must be either student or staff',
      },
      default: 'student',
    },
  },
  { timestamps: true }
);

/**
 * Virtual property: Generates a dynamically colored avatar URL based on the user's name.
 * Uses UI-Avatars service.
 */
userSchema.virtual('avatar').get(function () {
  const encoded = encodeURIComponent(this.name || 'User');
  return `https://ui-avatars.com/api/?name=${encoded}&background=random&size=128`;
});

// Ensure virtuals are serialized into JSON and Objects
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

/**
 * Pre-save Mongoose hook to hash the plain text password before saving to the database.
 * Uses bcrypt with 12 salt rounds for enhanced cryptographic security.
 */
userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) {
    return next();
  }

  const salt = await bcrypt.genSalt(12);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  next();
});

/**
 * Instance method to compare a plain-text password with the stored bcrypt hash.
 * @param {string} enteredPassword - The plain text candidate password.
 * @returns {Promise<boolean>} True if matching, false otherwise.
 */
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.passwordHash);
};

module.exports = mongoose.model('User', userSchema);

