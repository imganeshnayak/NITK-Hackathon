// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['farmer', 'admin', 'manufacturer'],
    default: 'farmer',
  },
  otp: { type: String },
  otpExpires: { type: Date },
  isVerified: { type: Boolean, default: false },
  // Farmer profile fields
  phone: { type: String },
  address: { type: String },
  photoUrl: { type: String },
  bio: { type: String },
  farmName: { type: String },
  farmSize: { type: String },
  certifications: [{ type: String }],
  socialLinks: [{ type: String }],
  location: {
    pincode: { type: String },
    city: { type: String },
    village: { type: String },
    state: { type: String }
  }
}, { timestamps: true });

// Hash password ONLY when it's being modified OR when the user is new and verified
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('User', UserSchema); 