const express = require('express');
const router = express.Router();
const { sendOtp, verifyOtpAndRegister, login } = require('../controllers/authController');

// @route   POST api/auth/send-otp
router.post('/send-otp', sendOtp);

// @route   POST api/auth/verify-otp
router.post('/verify-otp', verifyOtpAndRegister);

// @route   POST api/auth/login
router.post('/login', login);

module.exports = router;