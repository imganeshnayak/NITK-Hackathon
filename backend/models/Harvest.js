// models/Harvest.js
const mongoose = require('mongoose');

const HarvestSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  herb: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Herb',
    required: true,
  },
  // The separate 'herbName' field is no longer needed
  location: {
    description: { type: String },
    latitude: { type: String },
    longitude: { type: String },
  },
  quantity: { 
    value: { type: Number, required: true },
    unit: { type: String, default: 'kg', enum: ['kg', 'g', 'lb'] }
  },
  harvestDate: { 
    type: Date, 
    required: true 
  },
  // ... rest of the schema is the same
  status: {
    type: String,
    enum: ['Pending Verification', 'Verified', 'Rejected', 'Sold'],
    default: 'Pending Verification',
  },
  adminRemarks: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Harvest', HarvestSchema);