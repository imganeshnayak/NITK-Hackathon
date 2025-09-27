// routes/harvests.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createHarvest,
  getFarmerHarvests,
  getPendingHarvests,
  updateHarvestStatus,
  getVerifiedHarvests,
  getHarvestById // Import the new controller function we'll create
} = require('../controllers/harvestController');

// All routes here start with /api/harvests
const { getHarvestByQRCode } = require('../controllers/harvestController');

// --- Static GET routes first ---
router.get('/myharvests', auth, getFarmerHarvests);
router.get('/pending', auth, getPendingHarvests);
router.get('/verified', auth, getVerifiedHarvests);

// --- Public route for QR code ---
router.get('/qr/:qrCode', getHarvestByQRCode);

// --- Dynamic GET/PUT routes last ---
router.get('/:id', auth, getHarvestById);
router.put('/:id/status', auth, updateHarvestStatus);

// --- General POST route ---
router.post('/', auth, createHarvest);

module.exports = router;