// controllers/harvestController.js
const Harvest = require('../models/Harvest');
const Herb = require('../models/Herb');
const crypto = require('crypto');

// Create a new harvest record (for farmers)
exports.createHarvest = async (req, res) => {
  // Destructure all the fields from the request body
  const {
    herbId,
    herbName,
    quantity,
    unit,
    harvestDate,
    location,
    latitude,
    longitude,
    certifications,
    additionalInfo,
    photoUrl
  } = req.body;

  try {
    // Generate a unique QR code data
    const qrCodeData = crypto.randomBytes(16).toString('hex');
    
    // Create a new harvest object
    const newHarvest = new Harvest({
      farmer: req.user.id, // from auth middleware
      herb: herbId,
      herbName,
      location: {
        description: location,
        latitude,
        longitude
      },
      quantity: {
        value: quantity,
        unit: unit || 'kg'
      },
      harvestDate,
      photoUrl,
      certifications,
      additionalInfo,
      qrCodeData,
      status: 'Pending Verification'
    });

    const savedHarvest = await newHarvest.save();
    
    // Return the saved harvest with QR code data
    res.json(savedHarvest);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get all harvests for the currently logged-in farmer
exports.getFarmerHarvests = async (req, res) => {
  try {
    const harvests = await Harvest.find({ farmer: req.user.id })
      .sort({ createdAt: -1 })
      .populate('herb', 'name imageUrl');
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
      .populate('farmer', 'name email')
      .populate('herb', 'name botanicalName description imageUrl');
    
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
    // We use .populate() to get the farmer's name and email along with the harvest data
    const harvests = await Harvest.find({ status: 'Pending Verification' })
      .populate('farmer', ['name', 'email'])
      .populate('herb', 'name imageUrl')
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