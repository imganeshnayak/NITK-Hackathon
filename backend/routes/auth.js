const express = require('express');
const router = express.Router();
const { sendOtp, verifyOtpAndRegister, login } = require('../controllers/authController');

// @route   POST api/auth/send-otp
router.post('/send-otp', sendOtp);

// @route   POST api/auth/verify-otp
router.post('/verify-otp', verifyOtpAndRegister);

// @route   POST api/auth/login
router.post('/login', login);

// Get user profile by ID
const User = require('../models/user');
router.get('/users/:id', async (req, res) => {
	console.log('GET /users/:id called with id:', req.params.id);
	try {
		const user = await User.findById(req.params.id).select('-password -otp -otpExpires');
		if (!user) {
			console.log('User not found for id:', req.params.id);
			return res.status(404).json({ msg: 'User not found' });
		}
		console.log('User found:', user);
		res.json(user);
	} catch (err) {
		console.error('Error in GET /users/:id:', err);
		res.status(500).json({ msg: 'Server error', error: err.message });
	}
});

// Edit user profile (admin/manufacturer)
const verifyToken = require('../middleware/auth');
const { contract } = require('../blockchain');
router.put('/users/:id', verifyToken, async (req, res) => {
	try {
		// Only allow user to edit their own profile
		if (req.user.id !== req.params.id) {
			return res.status(403).json({ msg: 'Unauthorized' });
		}
		const updates = req.body;
		// Prevent password/otp change here
		delete updates.password;
		delete updates.otp;
		delete updates.otpExpires;
		const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true }).select('-password -otp -otpExpires');
		if (!user) return res.status(404).json({ msg: 'User not found' });

		// If admin, record profile update on blockchain
		if (user.role === 'admin') {
			try {
				// Example: call a contract method to record admin profile update
				// You may need to add this method to your contract
				const tx = await contract.recordAdminProfileUpdate(
					user._id.toString(),
					user.name,
					user.email,
					user.department || '',
					user.officeLocation || '',
					user.adminNotes || '',
					user.accessLevel || ''
				);
				await tx.wait();
				console.log(`Admin profile update recorded on blockchain. Tx hash: ${tx.hash}`);
			} catch (err) {
				console.error('Blockchain error (admin profile update):', err);
			}
		}
		res.json(user);
	} catch (err) {
		res.status(500).json({ msg: 'Server error', error: err.message });
	}
});

module.exports = router;