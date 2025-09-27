// controllers/harvestController.js
const Harvest = require('../models/Harvest');

// Create a new harvest record (for farmers)
exports.createHarvest = async (req, res) => {
  // Destructure all the new fields from the request body
  const {
    location,
    herb,
    harvest,
    initialQuality,
    sustainability
  } = req.body;

  try {
    const newHarvest = new Harvest({
      farmer: req.user.id, // from auth middleware
      location,
      herb,
      harvest,
      initialQuality,
      sustainability,
      // Status defaults to 'PendingVerification'
    });

    const savedHarvest = await newHarvest.save();
    res.json(savedHarvest);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get all harvests for the currently logged-in farmer
exports.getFarmerHarvests = async (req, res) => {
  try {
    const harvests = await Harvest.find({ farmer: req.user.id }).sort({ createdAt: -1 });
    res.json(harvests);
  } catch (err) {
    console.error(err.message);
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
    const harvests = await Harvest.find({ status: 'PendingVerification' })
      .populate('farmer', ['name', 'email'])
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
  const { status } = req.body;
  try {
    let harvest = await Harvest.findById(req.params.id);
    if (!harvest) return res.status(404).json({ msg: 'Harvest not found' });

    harvest.status = status;
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
      .populate('farmer', ['name', 'location'])
      .sort({ createdAt: -1 });
    res.json(harvests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};