// controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// This is the line that was missing
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Step 1: Send OTP to user's email
exports.sendOtp = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        // --- Password Validation Block (unchanged) ---
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ 
                msg: 'Password must be at least 8 characters long...' 
            });
        }

        let user = await User.findOne({ email, isVerified: true });
        if (user) {
            return res.status(400).json({ msg: 'A verified user with this email already exists.' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create or update a temporary user record with the HASHED password
        await User.findOneAndUpdate(
            { email },
            { name, email, password: hashedPassword, role, otp, otpExpires, isVerified: false },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        const msg = {
            to: email,
            from: {
                email: process.env.SENDGRID_FROM_EMAIL,
                name: 'VibeChain'
            },
            subject: 'Your VibeChain Verification Code',
            text: `Your OTP for VibeChain registration is: ${otp}`,
            html: `<strong>Your OTP for VibeChain registration is: ${otp}</strong>`,
        };

        await sgMail.send(msg); // This line will now work
        res.status(200).json({ msg: 'OTP sent to your email.' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Step 2: Verify OTP and complete registration
exports.verifyOtpAndRegister = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await User.findOne({ email, otp, otpExpires: { $gt: Date.now() } });

        if (!user) {
            return res.status(400).json({ msg: 'Invalid OTP or OTP has expired.' });
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save(); // This will trigger the password hashing pre-save hook

        const payload = { user: { id: user.id, role: user.role } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// --- User Registration ---
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }
    user = new User({ name, email, password, role });
    await user.save();
    
    // Create JWT
    const payload = { user: { id: user.id, role: user.role } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// --- User Login ---
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // Create JWT
    const payload = { user: { id: user.id, role: user.role } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};