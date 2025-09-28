// batches.js
const express = require('express');
const router = express.Router();
const batchController = require('../controllers/batchController');

// Farmer creates batch
router.post('/', batchController.createBatch);
// Get batch details
router.get('/:id', batchController.getBatch);
// Manufacturer updates batch
router.put('/:id/manufacturer', batchController.updateManufacturerDetails);
// Admin updates status
router.put('/:id/status', batchController.updateStatus);

module.exports = router;
