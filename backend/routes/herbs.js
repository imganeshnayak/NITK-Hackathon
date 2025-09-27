// routes/herbs.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getAllHerbs,
  getHerbById,
  createHerb,
  updateHerb,
  deleteHerb
} = require('../controllers/herbController');

// Public route - Get all herbs
router.get('/', getAllHerbs);

// Public route - Get a single herb by ID
router.get('/:id', getHerbById);

// Protected routes - Admin only
router.post('/', auth, createHerb);
router.put('/:id', auth, updateHerb);
router.delete('/:id', auth, deleteHerb);

module.exports = router;