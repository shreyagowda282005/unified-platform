const jwt = require('jsonwebtoken');
const User = require('../models/User');
const InfluencerProfile = require('../models/InfluencerProfile');
const BrandProfile = require('../models/BrandProfile');
const authController = require('../controllers/authController');
const { sendOTPEmail } = require('../services/emailService');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '7d'
  });
};

exports.register = async (req, res) => {
  try {
    const { email, userType, name } = req.body;

    if (!email || !userType) {
      return res.status(400).json({ message: 'Email and user type are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: 'Account already exists. Please log in.',
        promptLogin: true,
      });
    }

    const user = new User({
      name: name || email.split('@')[0],
      email,
      userType,
      isVerified: false,
    });

    // Generate OTP before save so it persists
    const otp = user.generateOTP();
    await user.save();

    // Create profile based on user type
    if (userType === 'influencer') {
      await InfluencerProfile.create({ userId: user._id, name: email.split('@')[0] });
    } else if (userType === 'brand') {
      await BrandProfile.create({ userId: user._id, companyName: email.split('@')[0] });
    }

    // Send OTP email (non-blocking - don't fail if email service is down)
    try {
      const emailResult = await sendOTPEmail(user.email, otp, user.name);
      if (!emailResult.success) {
        console.error('Email send error:', emailResult.error);
        console.warn('⚠️ Email sending failed, but OTP is generated. OTP:', otp);
      }
    } catch (emailError) {
      console.error('Email service error:', emailError);
      console.warn('⚠️ Email service unavailable, but OTP is generated. OTP:', otp);
    }

    res.status(201).json({
      message: 'Account created. Please verify the OTP sent to your email.',
      requiresVerification: true,
      userId: user._id,
      email: user.email,
      requiresPassword: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password only if user has a password (not Google OAuth users)
    if (user.password) {
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
    } else {
      // User doesn't have a password (Google OAuth user trying to login with email/password)
      return res.status(401).json({ message: 'Invalid credentials. Please use Google sign-in.' });
    }

    if (!user.isVerified) {
      const otp = user.generateOTP();
      
      await User.findByIdAndUpdate(
        user._id,
        { 
          otp: user.otp, 
          otpExpires: user.otpExpires 
        },
        { 
          runValidators: false
        }
      );

      const userName = user.name || user.email.split('@')[0];
      
      try {
        const emailResult = await sendOTPEmail(user.email, otp, userName);
        if (!emailResult.success) {
          console.error('Email send error:', emailResult.error);
          console.warn('⚠️ Email sending failed, but OTP is generated. OTP:', otp);
        }
      } catch (emailError) {
        console.error('Email service error:', emailError);
        console.warn('⚠️ Email service unavailable, but OTP is generated. OTP:', otp);
      }

      return res.status(403).json({
        message: 'Please verify the OTP sent to your email to continue.',
        requiresVerification: true,
        userId: user._id,
        email: user.email,
        requiresPassword: !user.password,
      });
    }

    await User.findByIdAndUpdate(
      user._id,
      { lastLogin: new Date() },
      { runValidators: false }
    );

    const token = generateToken(user._id);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        userType: user.userType
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

// ✅ NEW: Verify OTP endpoint
exports.verifyOTP = async (req, res) => {
  try {
    const { userId, otp, password } = req.body;

    console.log('Verify OTP request:', { userId, otp, hasPassword: !!password });

    if (!userId || !otp) {
      return res.status(400).json({ message: 'User ID and OTP are required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify OTP
    const otpVerification = user.verifyOTP(otp);
    if (!otpVerification.valid) {
      return res.status(400).json({ message: otpVerification.message || 'Invalid or expired OTP' });
    }

    // Prepare update object
    const updateData = {
      isVerified: true,
      verifiedAt: new Date(),
      otp: undefined,
      otpExpires: undefined
    };

    // If password is provided, hash and add it
    if (password) {
      const bcrypt = require('bcryptjs');
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Update user without triggering validation
    await User.findByIdAndUpdate(
      user._id,
      updateData,
      { runValidators: false }
    );

    // Generate token
    const token = generateToken(user._id);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      message: 'Email verified successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        userType: user.userType
      }
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ message: error.message || 'Server error during verification' });
  }
};

// ✅ NEW: Resend OTP endpoint
exports.resendOTP = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'User is already verified' });
    }

    // Generate new OTP
    const otp = user.generateOTP();
    
    // Update user with new OTP
    await User.findByIdAndUpdate(
      user._id,
      { 
        otp: user.otp, 
        otpExpires: user.otpExpires 
      },
      { runValidators: false }
    );

    const userName = user.name || user.email.split('@')[0];

    // Send OTP email
    try {
      const emailResult = await sendOTPEmail(user.email, otp, userName);
      if (!emailResult.success) {
        console.error('Email send error:', emailResult.error);
        console.warn('⚠️ Email sending failed, but OTP is generated. OTP:', otp);
      }
    } catch (emailError) {
      console.error('Email service error:', emailError);
      console.warn('⚠️ Email service unavailable, but OTP is generated. OTP:', otp);
    }

    res.json({
      message: 'OTP has been resent to your email',
      success: true
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ message: error.message || 'Failed to resend OTP' });
  }
};

exports.logout = (req, res) => {
  res.cookie('token', '', { maxAge: 0 });
  res.json({ message: 'Logged out successfully' });
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};