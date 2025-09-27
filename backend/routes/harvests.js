// routes/harvests.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createHarvest,
  getFarmerHarvests,
  getPendingHarvests,
  updateHarvestStatus,
  getVerifiedHarvests
} = require('../controllers/harvestController');

// All routes here are protected and start with /api/harvests

// Farmer routes
router.post('/', auth, createHarvest);
router.get('/myharvests', auth, getFarmerHarvests);

// Admin routes
router.get('/pending', auth, getPendingHarvests);
router.put('/:id/status', auth, updateHarvestStatus);

// Manufacturer (& Admin) routes
router.get('/verified', auth, getVerifiedHarvests);

module.exports = router;