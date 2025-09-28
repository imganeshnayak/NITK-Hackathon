// Manufacturer updates processing details for collected harvest
exports.updateManufacturerDetails = async (req, res) => {
  if (req.user.role !== 'manufacturer') {
    return res.status(403).json({ msg: 'Access denied. Only manufacturers can update.' });
  }
  try {
    const harvest = await Harvest.findById(req.params.id);
    if (!harvest) return res.status(404).json({ msg: 'Harvest not found' });
    if (harvest.status !== 'Collected') {
      return res.status(400).json({ msg: 'Only collected harvests can be updated.' });
    }
    if (harvest.collectedBy.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'You can only update harvests you collected.' });
    }
    const { processingDetails, remarks, storageLocation, batchNumber } = req.body;
    if (processingDetails !== undefined) harvest.manufacturerUpdate.processingDetails = processingDetails;
    if (remarks !== undefined) harvest.manufacturerUpdate.remarks = remarks;
    if (storageLocation !== undefined) harvest.manufacturerUpdate.storageLocation = storageLocation;
    if (batchNumber !== undefined) harvest.manufacturerUpdate.batchNumber = batchNumber;
    await harvest.save();
    res.json(harvest);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
// Manufacturer collects a harvest
exports.collectHarvest = async (req, res) => {
  if (req.user.role !== 'manufacturer') {
    return res.status(403).json({ msg: 'Access denied. Only manufacturers can collect.' });
  }
  try {
    const harvest = await Harvest.findById(req.params.id);
    if (!harvest) return res.status(404).json({ msg: 'Harvest not found' });
    if (harvest.status !== 'Verified') {
      return res.status(400).json({ msg: 'Only verified harvests can be collected.' });
    }
    harvest.collectedBy = req.user.id;
    harvest.status = 'Collected';
    await harvest.save();
    res.json(harvest);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
// controllers/harvestController.js
const Harvest = require('../models/Harvest');
const crypto = require('crypto'); 
const mongoose = require('mongoose');

const { recordBatch } = require('../blockchain');

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
        description: location?.description || location || '',
        village: location?.village || '',
        city: location?.city || '',
        pincode: location?.pincode || '',
        state: location?.state || ''
      },
      harvestDate,
      photoUrl: photoUrl || '',
      certifications: Array.isArray(certifications) ? certifications : [],
      additionalInfo: additionalInfo || '',
      qrCodeData: crypto.randomBytes(16).toString('hex')
    });

    // Save to MongoDB first
    const savedHarvest = await newHarvest.save();

    // Fetch farmer user document for blockchain tuple
    let blockchainTx = null;
    try {
      const User = require('../models/user');
      const farmerDoc = await User.findById(req.user.id);
      if (!farmerDoc) throw new Error('Farmer user not found');

      // Prepare farmer tuple for contract
      const farmerTuple = {
        name: farmerDoc.name || '',
        email: farmerDoc.email || '',
        village: farmerDoc.location?.village || '',
        city: farmerDoc.location?.city || '',
        pincode: farmerDoc.location?.pincode || '',
        state: farmerDoc.location?.state || ''
      };

      // Convert harvestDate to Unix timestamp
      const harvestTimestamp = Math.floor(new Date(harvestDate).getTime() / 1000);

      blockchainTx = await recordBatch(
        savedHarvest._id.toString(), // batchId
        herbName,
        farmerTuple,
        Number(quantity),
        unit,
        harvestTimestamp,
        Array.isArray(certifications) ? certifications : [],
        additionalInfo || ''
      );
      console.log('Blockchain Tx Hash:', blockchainTx);
      // Save hash to MongoDB
      savedHarvest.blockchainTx = blockchainTx;
      await savedHarvest.save();
    } catch (blockchainErr) {
      console.error('Blockchain recording error:', blockchainErr);
    }

    res.status(201).json({
      ...savedHarvest.toObject(),
      blockchainTx: savedHarvest.blockchainTx || blockchainTx
    });

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
      .sort({ createdAt: -1 });
    res.json(harvests.map(h => ({
      ...h.toObject(),
      blockchainTx: h.blockchainTx || ''
    })));
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
    // Fetch admin info
    let adminInfo = null;
    if (status === 'Verified') {
      const User = require('../models/user');
      const adminDoc = await User.findById(req.user.id);
      if (adminDoc) {
        adminInfo = {
          name: adminDoc.name || '',
          email: adminDoc.email || '',
          department: adminDoc.department || '',
          officeLocation: adminDoc.officeLocation || '',
          accessLevel: adminDoc.accessLevel || '',
          role: adminDoc.role || '',
          id: adminDoc._id.toString()
        };
      }
      // Encode admin info in adminRemarks as JSON
      harvest.adminRemarks = JSON.stringify({
        adminRemarks: adminRemarks || '',
        adminInfo
      });
      harvest.approvedBy = req.user.id;
      harvest.rejectedBy = null;
    } else if (status === 'Rejected') {
      harvest.adminRemarks = adminRemarks || '';
      harvest.rejectedBy = req.user.id;
      harvest.approvedBy = null;
    } else {
      if (adminRemarks) harvest.adminRemarks = adminRemarks;
    }

    // Call smart contract updateStatus if approved
    const { contract } = require('../blockchain');
    let blockchainTx = null;
    if (status === 'Verified') {
      try {
        const tx = await contract.updateStatus(
          harvest._id.toString(),
          status,
          harvest.adminRemarks // JSON string with admin info
        );
        await tx.wait();
        blockchainTx = tx.hash;
        harvest.blockchainTx = blockchainTx;
        // Log decoded admin info
        try {
          const decoded = JSON.parse(harvest.adminRemarks);
          console.log('Admin approval info:', decoded.adminInfo);
        } catch (e) {
          console.log('Could not decode admin info:', harvest.adminRemarks);
        }
        console.log(`Blockchain approval event: Harvest ${harvest._id} approved by admin ${req.user.id}. Tx hash: ${blockchainTx}`);
      } catch (blockchainErr) {
        console.error('Blockchain updateStatus error:', blockchainErr);
      }
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
      .sort({ createdAt: -1 });
    res.json(harvests.map(h => ({
      ...h.toObject(),
      blockchainTx: h.blockchainTx || ''
    })));
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