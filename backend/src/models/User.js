// Save as: backend/src/models/User.js
// Update your existing User model or replace it with this

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Basic Info
  name: {
    type: String,
    required: function() {
      return this.isNew && !this.googleId; // Only required for non-Google users
    },
    default: '',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId && this.isVerified; // required once verified for email users
    },
  },
  userType: {
    type: String,
    enum: ['influencer', 'brand', 'admin'],
    required: true,
  },
  
  profilePicture: String,
  // Google OAuth
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  profilePicture: String,
  
  // Email Verification & OTP
  isVerified: {
    type: Boolean,
    default: false,
  },
  otp: {
    type: String,
  },
  otpExpires: {
    type: Date,
  },
  verifiedAt: {
    type: Date,
  },
  
  // Account Status
  isActive: {
    type: Boolean,
    default: true,
  },
  
  // Profile completion (for influencers)
  profileCompleted: {
    type: Boolean,
    default: false,
  },
  
  // Social Media (for influencers)
  socialMedia: {
    instagram: String,
    youtube: String,
    tiktok: String,
    twitter: String,
  },
  
  // Metrics (for influencers)
  metrics: {
    followers: { type: Number, default: 0 },
    engagement: { type: Number, default: 0 },
    averageViews: { type: Number, default: 0 },
  },
  
  // Company Info (for brands)
  companyName: String,
  companyWebsite: String,
  industry: String,
  
  // Additional
  bio: String,
  location: String,
  phone: String,
  
  // Timestamps
  lastLogin: Date,
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  if (this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate OTP
userSchema.methods.generateOTP = function() {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.otp = otp;
  this.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  return otp;
};

// Verify OTP
userSchema.methods.verifyOTP = function(inputOTP) {
  if (!this.otp || !this.otpExpires) {
    return { valid: false, message: 'No OTP found' };
  }
  
  if (this.otpExpires < new Date()) {
    return { valid: false, message: 'OTP has expired' };
  }
  
  if (this.otp !== inputOTP) {
    return { valid: false, message: 'Invalid OTP' };
  }
  
  return { valid: true };
};

// Clear OTP
userSchema.methods.clearOTP = function() {
  this.otp = undefined;
  this.otpExpires = undefined;
};

module.exports = mongoose.model('User', userSchema);