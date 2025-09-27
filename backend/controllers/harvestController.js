// controllers/harvestController.js
const Harvest = require('../models/Harvest');
const crypto = require('crypto'); 
const mongoose = require('mongoose');

exports.createHarvest = async (req, res) => {
   console.log('User payload:', req.user);  
  console.log('Request body:', req.body);
  try {
    const {
      herbName,
      quantity,
      unit = 'kg',
      harvestDate,
      location,
      latitude,
      longitude,
      certifications,
      additionalInfo,
      photoUrl
    } = req.body;

    // --- Basic validation ---
    if (!req.user || !req.user.id) {
      return res.status(401).json({ msg: 'Unauthorized: User not found in request' });
    }
      if (!herbName) return res.status(400).json({ msg: 'Herb name is required' });
      if (!quantity || isNaN(quantity)) return res.status(400).json({ msg: 'Quantity is required and must be a number' });
      if (!harvestDate) return res.status(400).json({ msg: 'Harvest date is required' });

    // --- Map frontend data to schema ---
    const newHarvest = new Harvest({
      farmer: req.user.id,
      herbName,
      quantity: { value: Number(quantity), unit },
      location: {
        description: location || '',
        latitude: latitude || '',
        longitude: longitude || ''
      },
      harvestDate,
      photoUrl: photoUrl || '',
      certifications: Array.isArray(certifications) ? certifications : [],
      additionalInfo: additionalInfo || '',
      qrCodeData: crypto.randomBytes(16).toString('hex')
    });

    const savedHarvest = await newHarvest.save();
    res.status(201).json(savedHarvest);

  } catch (err) {
    console.error('Harvest creation error:', err);
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
};


// Get all harvests for the currently logged-in farmer
exports.getFarmerHarvests = async (req, res) => {
  try {
    const harvests = await Harvest.find({ farmer: req.user.id })
      .sort({ createdAt: -1 });
    res.json(harvests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get all VERIFIED harvests (for manufacturers)
exports.getVerifiedHarvests = async (req, res) => {
  if (req.user.role !== 'manufacturer' && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied.' });
  }
  try {
    const harvests = await Harvest.find({ status: 'Verified' })
      .populate('farmer', 'name')
      // REMOVED: .populate('herb', 'name')
      .sort({ createdAt: -1 });
    res.json(harvests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
// Get a single harvest by ID
exports.getHarvestById = async (req, res) => {
  try {
    const harvest = await Harvest.findById(req.params.id)
      .populate('farmer', 'name email');
    
    if (!harvest) {
      return res.status(404).json({ msg: 'Harvest not found' });
    }
    
    // Check if the user is authorized to view this harvest
    if (
      harvest.farmer._id.toString() !== req.user.id && 
      req.user.role !== 'admin' && 
      (req.user.role !== 'manufacturer' || harvest.status !== 'Verified')
    ) {
      return res.status(403).json({ msg: 'Access denied.' });
    }
    
    res.json(harvest);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Harvest not found' });
    }
    res.status(500).send('Server Error');
  }
};

// Get all pending harvests (for admins)
exports.getPendingHarvests = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Access denied. Admins only.' });
  }
  try {
    const harvests = await Harvest.find({ status: 'Pending Verification' })
      .populate('farmer', ['name', 'email'])
      // REMOVED: .populate('herb', 'name imageUrl')
      .sort({ createdAt: -1 });
    res.json(harvests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update a harvest's status (for admins)
exports.updateHarvestStatus = async (req, res) => {
   if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied. Admins only.' });
  }
  const { status, adminRemarks } = req.body;
  try {
    let harvest = await Harvest.findById(req.params.id);
    if (!harvest) return res.status(404).json({ msg: 'Harvest not found' });

    harvest.status = status;
    if (adminRemarks) {
      harvest.adminRemarks = adminRemarks;
    }
    await harvest.save();
    res.json(harvest);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get all VERIFIED harvests (for manufacturers)
exports.getVerifiedHarvests = async (req, res) => {
  if (req.user.role !== 'manufacturer' && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied.' });
  }
  try {
    const harvests = await Harvest.find({ status: 'Verified' })
      .populate('farmer', ['name', 'email'])
      .populate('herb', 'name imageUrl')
      .sort({ createdAt: -1 });
    res.json(harvests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get harvest by QR Code
exports.getHarvestByQRCode = async (req, res) => {
  try {
    const { qrCode } = req.params;
    const harvest = await Harvest.findOne({ qrCodeData: qrCode })
      .populate('farmer', 'name email')
      .populate('herb', 'name botanicalName description imageUrl');
    
    if (!harvest) {
      return res.status(404).json({ msg: 'No harvest found with this QR code' });
    }
    
    res.json(harvest);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};