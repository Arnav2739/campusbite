// [Aditya] User.js - Student and Staff Mongoose Model
// Commit 1: Enhanced with bcrypt hashing, matchPassword, phone, avatar virtual
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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

// --- Virtual: Generate avatar URL from user's name ---
userSchema.virtual('avatar').get(function () {
  const encoded = encodeURIComponent(this.name || 'User');
  return `https://ui-avatars.com/api/?name=${encoded}&background=random&size=128`;
});

// Ensure virtuals are included in JSON and Object output
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

// --- Pre-save hook: Hash password before saving ---
userSchema.pre('save', async function (next) {
  // Only hash if the passwordHash field has been modified (or is new)
  if (!this.isModified('passwordHash')) {
    return next();
  }

  const salt = await bcrypt.genSalt(12);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  next();
});

// --- Instance method: Compare entered password with stored hash ---
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.passwordHash);
};

module.exports = mongoose.model('User', userSchema);
