// [Aditya] User.js - Student and Staff Mongoose Model
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    rollNumber: { type: String },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['student', 'staff'], default: 'student' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
