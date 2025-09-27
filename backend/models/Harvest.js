// models/Harvest.js
const mongoose = require('mongoose');

const HarvestSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
<<<<<<< HEAD
  // This now links directly to your Herb model
=======
  // --- FIX: This now correctly links to the Herb model ---
>>>>>>> 8bff56f461ade4b22631b632aedc710e2a77ce2e
  herb: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Herb',
    required: true,
  },
<<<<<<< HEAD
  // We can remove the redundant 'herbName' field
=======
  // The separate 'herbName' field is no longer needed
>>>>>>> 8bff56f461ade4b22631b632aedc710e2a77ce2e
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