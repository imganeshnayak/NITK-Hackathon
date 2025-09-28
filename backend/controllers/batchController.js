// batchController.js
const Batch = require('../models/Batch'); // If you have a Batch model
const blockchain = require('../blockchain');

// Record a new batch (Farmer step)
exports.createBatch = async (req, res) => {
  try {
    // Ensure batchId is present
    let { batchId } = req.body;
    if (!batchId) {
      batchId = 'VC-' + Date.now();
      req.body.batchId = batchId;
    }

    // Save batch to MongoDB
    const batch = new Batch(req.body);
    await batch.save();

    // Prepare blockchain data
    const { herbName, farmer, quantity, unit, harvestDate, certifications, additionalInfo } = req.body;
    const txHash = await blockchain.recordBatch(
      batchId,
      herbName,
      farmer,
      quantity,
      unit,
      harvestDate,
      certifications,
      additionalInfo
    );

    res.status(201).json({ batch, blockchainTx: txHash });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get batch details (from MongoDB and blockchain)
exports.getBatch = async (req, res) => {
  try {
    const paramId = req.params.id;
    let batch = null;
    // Try to find by _id (ObjectId)
    if (/^[a-fA-F0-9]{24}$/.test(paramId)) {
      batch = await Batch.findById(paramId)
        .populate('farmer', 'name email village city pincode state')
        .populate('approvedBy', 'name email department officeLocation accessLevel role');
    }
    // If not found, try to find by batchId (string)
    if (!batch) {
      batch = await Batch.findOne({ batchId: paramId })
        .populate('farmer', 'name email village city pincode state')
        .populate('approvedBy', 'name email department officeLocation accessLevel role');
    }
    if (!batch) return res.status(404).json({ error: 'Batch not found' });

    // Optionally fetch blockchain data
    let blockchainData = null;
    try {
      blockchainData = await blockchain.getBatch(batch.batchId);
    } catch (e) {
      blockchainData = null;
    }

    // Parse admin info from adminRemarks
    let adminInfo = null;
    if (batch.adminRemarks) {
      try {
        const parsed = JSON.parse(batch.adminRemarks);
        adminInfo = parsed.adminInfo || null;
      } catch (e) {
        adminInfo = null;
      }
    }

    // Merge MongoDB and blockchain data
    const response = {
      batchId: batch.batchId,
      herbName: batch.herbName,
      farmer: batch.farmer, // Now populated
      quantity: batch.quantity,
      unit: batch.unit,
      harvestDate: batch.harvestDate,
      certifications: batch.certifications,
      additionalInfo: batch.additionalInfo,
      status: batch.status,
      adminRemarks: batch.adminRemarks,
      manufacturerUpdate: batch.manufacturerUpdate,
      blockchainTx: batch.blockchainTx || (blockchainData && blockchainData.txHash),
      adminInfo // Parsed from adminRemarks
    };
    res.json({ batchData: response });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Manufacturer update step
exports.updateManufacturerDetails = async (req, res) => {
  try {
    const batchId = req.params.id;
    const update = req.body; // { processingDetails, remarks, storageLocation, batchNumber }
    const tx = await blockchain.contract.updateManufacturerDetails(batchId, update);
    await tx.wait();
    res.json({ message: 'Manufacturer details updated', txHash: tx.hash });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin status update step
exports.updateStatus = async (req, res) => {
  try {
    const batchId = req.params.id;
    const { status, adminRemarks } = req.body;
    const tx = await blockchain.contract.updateStatus(batchId, status, adminRemarks);
    await tx.wait();
    res.json({ message: 'Status updated', txHash: tx.hash });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
