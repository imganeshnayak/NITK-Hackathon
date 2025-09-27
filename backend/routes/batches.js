// routes/batches.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Import auth middleware
const {
  createBatch,
  getFarmerBatches,
  getPendingBatches,
  updateBatchStatus
} = require('../controllers/batchController');

// @route   POST api/batches
// @desc    Create a new batch (Protected)
router.post('/', auth, createBatch);

// @route   GET api/batches/mybatches
// @desc    Get batches for the logged-in farmer (Protected)
router.get('/mybatches', auth, getFarmerBatches);

// @route   GET api/batches/pending
// @desc    Get all pending batches for admin (Protected)
router.get('/pending', auth, getPendingBatches);

// @route   PUT api/batches/:id/status
// @desc    Update a batch status by admin (Protected)
router.put('/:id/status', auth, updateBatchStatus);

module.exports = router;