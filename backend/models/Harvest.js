
// models/Harvest.js
const mongoose = require('mongoose');

const HarvestSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  herbName: {
    type: String,
    required: true,
  },
  // The separate 'herbName' field is no longer needed
  location: {
    description: { type: String },
    village: { type: String },
    city: { type: String },
    pincode: { type: String },
    state: { type: String },
  },
  quantity: { 
    value: { type: Number, required: true },
    unit: { type: String, default: 'kg', enum: ['kg', 'g', 'lb'] }
  },
  manufacturerUpdate: {
    processingDetails: { type: String, default: '' },
    remarks: { type: String, default: '' },
    storageLocation: { type: String, default: '' },
    batchNumber: { type: String, default: '' }
  },
  harvestDate: { 
    type: Date, 
    required: true 
  },
  manufacturerUpdate: {
    processingDetails: { type: String, default: '' },
    remarks: { type: String, default: '' },
    storageLocation: { type: String, default: '' },
    batchNumber: { type: String, default: '' }
  },
  status: {
    type: String,
    enum: ['Pending Verification', 'Verified', 'Rejected', 'Collected', 'Sold'],
    default: 'Pending Verification',
  },
  collectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  adminRemarks: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Harvest', HarvestSchema);