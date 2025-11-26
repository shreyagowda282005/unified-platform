// Save as: backend/src/routes/googleAuth.js
// Replace your existing googleAuth.js with this

const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendOTPEmail, sendWelcomeEmail } = require('../services/emailService');

const router = express.Router();

// Configure Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user exists
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          // Check if email already exists
          user = await User.findOne({ email: profile.emails[0].value });

          if (user) {
            // Link Google account to existing user
            user.googleId = profile.id;
            user.profilePicture = profile.photos[0]?.value;
            
            // If user was not verified, mark as verified (Google emails are verified)
            if (!user.isVerified) {
              user.isVerified = true;
              user.verifiedAt = new Date();
            }
            
            await user.save();
          } else {
            // Create new user (unverified initially)
            user = await User.create({
              googleId: profile.id,
              email: profile.emails[0].value,
              name: profile.displayName,
              profilePicture: profile.photos[0]?.value,
              userType: 'influencer', // Default
              isVerified: false, // Will be verified after OTP
            });
          }
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Initialize Passport
router.use(passport.initialize());

// @route   GET /api/auth/google
// @desc    Start Google OAuth flow
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })
);

// @route   GET /api/auth/google/callback
// @desc    Google OAuth callback
router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_auth_failed`,
  }),
  async (req, res) => {
    try {
      const user = req.user;

      // Check if user is already verified
      if (user.isVerified) {
        // User is already verified, generate token and redirect
        const token = jwt.sign(
          { id: user._id, email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: '7d' }
        );

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        const redirectUrl = `${process.env.FRONTEND_URL}/auth/callback?token=${token}&userType=${user.userType}`;
        return res.redirect(redirectUrl);
      }

      // User needs OTP verification
      // Generate and send OTP
      const otp = user.generateOTP();
      await user.save();

      const emailResult = await sendOTPEmail(user.email, otp, user.name);

      if (!emailResult.success) {
        console.error('Failed to send OTP email:', emailResult.error);
        return res.redirect(`${process.env.FRONTEND_URL}/login?error=email_send_failed`);
      }

      // Redirect to OTP verification page with user ID
      const redirectUrl = `${process.env.FRONTEND_URL}/verify-otp?userId=${user._id}&email=${encodeURIComponent(user.email)}&requiresPassword=false`;
      res.redirect(redirectUrl);
      
    } catch (error) {
      console.error('Google callback error:', error);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=authentication_failed`);
    }
  }
);

// @route   POST /api/auth/verify-otp
// @desc    Verify OTP and complete registration
router.post('/verify-otp', async (req, res) => {
  try {
    const { userId, otp, password } = req.body;

    if (!userId || !otp) {
      return res.status(400).json({ message: 'User ID and OTP are required' });
    }

    // Find user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify OTP
    const otpVerification = user.verifyOTP(otp);

    if (!otpVerification.valid) {
      return res.status(400).json({ message: otpVerification.message });
    }

    // For email/password users, ensure password is provided if missing
    if (!user.googleId && !user.password) {
      if (!password || password.length < 6) {
        return res.status(400).json({ message: 'Please provide a password with at least 6 characters.' });
      }
      user.password = password;
    }

    // Mark user as verified
    user.isVerified = true;
    user.verifiedAt = new Date();
    user.clearOTP();
    user.lastLogin = new Date();
    await user.save();

    // Send welcome email
    await sendWelcomeEmail(user.email, user.name, user.userType);

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Email verified successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        profilePicture: user.profilePicture,
        isVerified: user.isVerified,
        requiresPassword: !user.googleId && !user.password,
      },
    });

  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ message: 'Server error during OTP verification' });
  }
});

// @route   POST /api/auth/resend-otp
// @desc    Resend OTP
router.post('/resend-otp', async (req, res) => {
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
    await user.save();

    // Send OTP email
    const emailResult = await sendOTPEmail(user.email, otp, user.name);

    if (!emailResult.success) {
      return res.status(500).json({ message: 'Failed to send OTP email' });
    }

    res.json({
      success: true,
      message: 'OTP has been resent to your email',
    });

  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ message: 'Server error while resending OTP' });
  }
});

module.exports = router;