// controllers/batchController.js
const Batch = require('../models/Batch');

// Create a new batch (for logged-in farmers)
exports.createBatch = async (req, res) => {
  const { herbName, location } = req.body;
  try {
    const newBatch = new Batch({
      herbName,
      location,
      farmer: req.user.id, // Get the user ID from the auth middleware
    });
    const batch = await newBatch.save();
    res.json(batch);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get all batches for the currently logged-in farmer
exports.getFarmerBatches = async (req, res) => {
  try {
    const batches = await Batch.find({ farmer: req.user.id }).sort({ createdAt: -1 });
    res.json(batches);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get all pending batches (for admins)
exports.getPendingBatches = async (req, res) => {
  // Check if user is an admin
  if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied. Admins only.' });
  }
  try {
    const batches = await Batch.find({ status: 'Pending' }).sort({ createdAt: -1 });
    res.json(batches);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update a batch's status (for admins)
exports.updateBatchStatus = async (req, res) => {
   if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied. Admins only.' });
  }
  const { status } = req.body;
  try {
    let batch = await Batch.findById(req.params.id);
    if (!batch) return res.status(404).json({ msg: 'Batch not found' });

    batch.status = status;
    await batch.save();
    res.json(batch);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};