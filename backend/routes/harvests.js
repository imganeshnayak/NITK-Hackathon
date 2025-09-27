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

// All routes here are protected and start with /api/harvests

// --- Static routes first ---
router.get('/myharvests', auth, getFarmerHarvests);
router.get('/pending', auth, getPendingHarvests);
router.get('/verified', auth, getVerifiedHarvests);

// --- Dynamic routes last ---
router.get('/:id', auth, getHarvestById); // New route to get a single harvest by its ID
router.put('/:id/status', auth, updateHarvestStatus);

// --- General routes ---
router.post('/', auth, createHarvest);

module.exports = router;