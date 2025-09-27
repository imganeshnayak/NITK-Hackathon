// models/Harvest.js
const mongoose = require('mongoose');

const HarvestSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  herb: {
    type: String,
    required: true,
  },
  herbName: { 
    type: String, 
    required: true 
  },
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
  photoUrl: { 
    type: String 
  },
  certifications: [{
    type: String,
    enum: ['Organic', 'Fair Trade', 'Non-GMO', 'Vegan', 'Sustainable', 'Traditional']
  }],
  additionalInfo: {
    type: String
  },
  qrCodeData: {
    type: String
  },
  status: {
    type: String,
    enum: ['Pending Verification', 'Verified', 'Rejected', 'Sold'],
    default: 'Pending Verification',
  },
}, { timestamps: true });

module.exports = mongoose.model('Harvest', HarvestSchema);