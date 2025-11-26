const express = require('express');
const router = express.Router();
const { register, login, logout, getMe } = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const authController = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
// In your auth.js routes file, add these lines:
router.post('/verify-otp', authController.verifyOTP);
router.post('/resend-otp', authController.resendOTP);
router.get('/me', auth, getMe);

module.exports = router;







